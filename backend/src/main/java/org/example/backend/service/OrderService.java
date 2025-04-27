package org.example.backend.service;

import org.example.backend.DTO.OrderRequestDTO;
import org.example.backend.DTO.OrderResponseDTO;
import org.example.backend.model.order.Order;
import org.example.backend.repository.OrderRepository;
import org.example.backend.repository.PaymentMethodRepository;
import org.example.backend.repository.UserRepository;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
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

    public List<OrderResponseDTO> readAll() {
        return orderRepository.findAll().stream()
                .map(OrderResponseDTO::new)
                .collect(Collectors.toList());
    }



    public Order read(Long id) {
        return orderRepository.findById(id).orElse(null);
    }


}
