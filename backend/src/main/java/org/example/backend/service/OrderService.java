package org.example.backend.service;

import org.example.backend.DTO.OrderRequestDTO;
import org.example.backend.DTO.OrderResponseDTO;
import org.example.backend.model.order.Order;
import org.example.backend.model.user.User;
import org.example.backend.repository.OrderRepository;
import org.example.backend.repository.PaymentMethodRepository;
import org.example.backend.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    public OrderService(OrderRepository orderRepository, UserRepository userRepository, PaymentMethodRepository paymentMethodRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.paymentMethodRepository = paymentMethodRepository;
    }

    public void create(OrderRequestDTO order) {
        Order newOrder = new Order();
        newOrder.copyFrom(order);
        newOrder.setMaker(userRepository.getReferenceById(1L));
        newOrder.setPaymentMethod(paymentMethodRepository.getReferenceById(order.getPaymentMethodId()));

        orderRepository.save(newOrder);
    }

    public Long getUserOrdersCount(User user) {
        return orderRepository.findAllByMaker(user).stream().count();
    }

    public Page<OrderResponseDTO> readAll(User user, String method, String coin, Pageable paging) {
        Long ordersCount = getUserOrdersCount(user);
        Long percentOrdersCount = ordersCount / ordersCount * 100;
        Page<Order> ordersPage;
        if (Objects.equals(method, "Все методы")) {
            ordersPage = orderRepository.findAllByCurrency_Name(coin, paging);
        }
        else {
            ordersPage = orderRepository.findAllByPaymentMethod_Bank_NameAndCurrency_Name(method, coin, paging);
        }

        return ordersPage.map(order ->
                new OrderResponseDTO(order, ordersCount, percentOrdersCount));
    }




    public Order read(Long id) {
        return orderRepository.findById(id).orElse(null);
    }


}
