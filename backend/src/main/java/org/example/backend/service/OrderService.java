package org.example.backend.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.Tuple;
import lombok.RequiredArgsConstructor;
import org.example.backend.DTO.*;
import org.example.backend.model.NotificationType;
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
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final OrderResponseRepository orderResponseRepository;
    private final CurrencyRepository currencyRepository;
    private final UserService userService;
    private final NotificationService notificationService;
    private final ResponseService responseService;
    public void create(OrderRequestDTO order, User user) {
        Order newOrder = new Order();
        newOrder.copyFrom(order);
        newOrder.setCurrency(currencyRepository.findByName(order.getCurrency()));
        newOrder.setMaker(user);
        newOrder.setPaymentMethod(paymentMethodRepository.getReferenceById(order.getPaymentMethodId()));

        orderRepository.save(newOrder);
    }



    public Page<OrderResponseDTO> readAll(String method, String coin, String type, User user, Pageable paging) {
        Page<Order> ordersPage;


        ordersPage = orderRepository.findAllByCurrencyAndTypeAndUserFilter(
                method,
                coin,
                type,
                user,
                paging
        );

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
            Long responseId = tuple.get(3, Long.class);
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
                    responseId != null ? responseId : -1,
                    taker
            );
        });
    }




    public Order read(Long id) {
        return orderRepository.findById(id).orElseThrow(
                EntityNotFoundException::new
        );
    }

    public OrderDetailsDTO createResponse(Long orderId, User user) {
        Order order = read(orderId);
        order.setIsAvailable(false);
        orderRepository.save(order);
        OrderResponse response = responseService.createResponse(order, user);

        return new OrderDetailsDTO(response);
    }


}
