package org.example.backend.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.Tuple;
import lombok.RequiredArgsConstructor;
import org.example.backend.DTO.OrderDetailsDTO;
import org.example.backend.DTO.OrderRequestDTO;
import org.example.backend.DTO.OrderResponseDTO;
import org.example.backend.DTO.OrderWithStatusDTO;
import org.example.backend.model.order.Order;
import org.example.backend.model.order.OrderResponse;
import org.example.backend.model.order.OrderStatus;
import org.example.backend.model.order.OrderType;
import org.example.backend.model.user.User;
import org.example.backend.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final OrderResponseRepository orderResponseRepository;
    private final CurrencyRepository currencyRepository;
    private final UserService userService;


    public void create(OrderRequestDTO order, User user) {
        Order newOrder = new Order();
        newOrder.copyFrom(order);
        newOrder.setCurrency(currencyRepository.findByName(order.getCurrency()));
        newOrder.setMaker(user);
        newOrder.setPaymentMethod(paymentMethodRepository.getReferenceById(order.getPaymentMethodId()));

        orderRepository.save(newOrder);
    }



    public Page<OrderResponseDTO> readAll(String method, String coin, OrderType type, Pageable paging) {
        Page<Order> ordersPage;

        if ("Все методы".equals(method)) {
            ordersPage = orderRepository.findAllByIsAvailableTrueAndCurrency_NameAndType(coin, type, paging);
        } else {
            ordersPage = orderRepository.findAllByIsAvailableTrueAndPaymentMethod_Bank_NameAndCurrency_NameAndType(
                    method,
                    coin,
                    type,
                    paging
            );
        }

        return ordersPage.map(order -> {
            User maker = order.getMaker();

            long totalMakerOrders = orderRepository.countByMakerAndIsAvailableTrue(maker) + orderResponseRepository.countByTaker(maker) + orderResponseRepository.countByOrder_Maker(maker);
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
            User taker;
            if (takerId == null) {
                taker = new User();
            }
            else if (Objects.equals(takerId, userId)) {
                taker = order.getMaker();
            }
            else {
                taker = userService.findUserById(takerId);
            }

            return new OrderWithStatusDTO(
                    order,
                    status != null ? status : OrderStatus.PENDING,
                    taker
            );
        });
    }




    public Order read(Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    public OrderDetailsDTO createResponse(Long orderId, User user) {
        OrderResponse response = new OrderResponse();
        response.setOrder(read(orderId));
        response.setTaker(user);
        response.setStatus(OrderStatus.ACTIVE);
        orderResponseRepository.save(response);

        return new OrderDetailsDTO(response);
    }


}
