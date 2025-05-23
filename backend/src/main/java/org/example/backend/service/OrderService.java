package org.example.backend.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.Tuple;
import lombok.RequiredArgsConstructor;
import org.example.backend.DTO.*;
import org.example.backend.exception.InsufficientBalanceException;
import org.example.backend.model.Currency;
import org.example.backend.model.NotificationType;
import org.example.backend.model.order.Order;
import org.example.backend.model.order.OrderResponse;
import org.example.backend.model.order.OrderStatus;
import org.example.backend.model.order.OrderType;
import org.example.backend.model.user.Balance;
import org.example.backend.model.user.Bank;
import org.example.backend.model.user.PaymentMethod;
import org.example.backend.model.user.User;
import org.example.backend.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.Objects;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final OrderResponseRepository orderResponseRepository;
    private final CurrencyRepository currencyRepository;
    private final UserService userService;
    private final ResponseService responseService;
    private final BalanceRepository balanceRepository;
    private final BankRepository bankRepository;
    private final BalanceService balanceService;

    public void create(OrderRequestDTO order, User user) {
        Currency orderCurrency = currencyRepository.findByShortName(order.getCurrency());
        Balance userBalance = balanceRepository.findBalanceByUserAndCurrency(user, orderCurrency);
        Order newOrder = new Order();
        if (order.getType() == OrderType.SELL) {
            if (userBalance.getAvailable().compareTo(order.getAmount()) < 0) {
                throw new InsufficientBalanceException("Недостаточно средств для размещения объявления");
            }
            userBalance.setLocked(userBalance.getLocked().add(order.getAmount()));
            userBalance.setAvailable(userBalance.getAvailable().subtract(order.getAmount()));
            balanceRepository.save(userBalance);
            newOrder.setPaymentMethod(paymentMethodRepository.getReferenceById(order.getPaymentMethodId()));
        }
        else {
            Bank bank = bankRepository.findBankByName(order.getPreferredBank());
            newOrder.setPreferredBank(bank);
        }
        newOrder.copyFrom(order);
        newOrder.setCurrency(orderCurrency);
        newOrder.setMaker(user);

        orderRepository.save(newOrder);
    }



    public Page<OrderResponseDTO> readAll(String method, String coin, String type, User user, Pageable paging) {
        Page<Order> ordersPage;
        Bank methodBank = bankRepository.findBankByName(method);
        System.out.println(method);
        System.out.println(coin);
        System.out.println(type);
        System.out.println(user);
        if (Objects.equals(type, "BUY")) {
            ordersPage = orderRepository.findAllByCurrencyAndType_SellAndUserFilter(
                    methodBank == null ? null : methodBank.getId(),
                    coin,
                    user == null ? null : user.getId(),
                    paging
            );
        }
        else {
            ordersPage = orderRepository.findAllByCurrencyAndType_BuyAndUserFilter(
                    methodBank == null ? null : methodBank.getId(),
                    coin,
                    user == null ? null : user.getId(),
                    paging
            );
        }



        return ordersPage.map(order -> {
            User maker = order.getMaker();

            long totalMakerOrders = orderResponseRepository.countByTaker(maker) + orderResponseRepository.countByOrder_Maker(maker);
            long completedMakerOrders = orderResponseRepository.countByTakerAndStatus(maker, OrderStatus.COMPLETED) + orderResponseRepository.countByOrder_MakerAndStatus(maker, OrderStatus.COMPLETED);
            Long completionPercentage = totalMakerOrders > 0
                    ? (long) (((double) completedMakerOrders / totalMakerOrders) * 100)
                    : 0;

            return new OrderResponseDTO(
                    order,
                    totalMakerOrders,
                    completionPercentage
            );
        });
    }

    public Page<OrderWithStatusDTO> getUserOrders(Long userId, String responseStatus, String currency, OrderType type, Pageable paging) {

        if (!userService.existsById(userId)) {
            throw new EntityNotFoundException("User not found with id: " + userId);
        }

        Page<Tuple> resultPage = orderRepository.findUserOrdersWithStatus(
                userId,
                currency,
                type,
                OrderStatus.fromString(responseStatus),
                paging
        );

        return resultPage.map(tuple -> {
            Order order = tuple.get(0, Order.class);
            OrderStatus status = tuple.get(1, OrderStatus.class);
            Long takerId = tuple.get(2, Long.class);
            Long responseId = tuple.get(3, Long.class);
            User taker;
            OrderType ordertype = order.getType();

            if (takerId == null) {
                taker = new User();
            }
            else if (Objects.equals(takerId, userId)) {
                taker = order.getMaker();
                ordertype = order.getType() == OrderType.BUY ? OrderType.SELL : OrderType.BUY;
            }
            else {
                taker = userService.findUserById(takerId);
            }

            return new OrderWithStatusDTO(
                    order,
                    status != null ? status : OrderStatus.PENDING,
                    responseId != null ? responseId : -1,
                    taker,
                    ordertype
            );
        });
    }




    public Order read(Long id) {
        return orderRepository.findById(id).orElseThrow(
                EntityNotFoundException::new
        );
    }

    public OrderDetailsDTO createResponse(Long orderId, Long paymentMethodId, User user) throws Exception {
        Order order = read(orderId);
        if (order.getType() == OrderType.BUY) {
            PaymentMethod method = paymentMethodRepository.getReferenceById(paymentMethodId);
            order.setPaymentMethod(method);
            Balance userBalance = balanceRepository.findBalanceByUserAndCurrency(user, order.getCurrency());
            if (userBalance.getAvailable().compareTo(order.getAmount()) < 0) {
                throw new InsufficientBalanceException("Недостаточно средств для отклика на объявление");
            }
        }

        order.setIsAvailable(false);
        orderRepository.save(order);

        OrderResponse response = responseService.createResponse(order, user);

        return new OrderDetailsDTO(response);
    }

    public void makeOrderAvailable(Order order) {
        order.setIsAvailable(true);
        orderRepository.save(order);
    }


    public void setIsUnavailable(Long orderId, User user) throws AccessDeniedException {
        Order order = orderRepository.findById(orderId).orElseThrow(
                EntityNotFoundException::new
        );
        if (!Objects.equals(order.getMaker().getId(), user.getId())) {
            throw new AccessDeniedException("Запрещено");
        }
        order.setIsAvailable(false);
        Balance balance = balanceRepository.findBalanceByUserAndCurrency(user , order.getCurrency());
        balance.setAvailable(balance.getAvailable().add(order.getAmount()));
        balance.setLocked(balance.getLocked().subtract(order.getAmount()));
        orderRepository.save(order);

    }
}
