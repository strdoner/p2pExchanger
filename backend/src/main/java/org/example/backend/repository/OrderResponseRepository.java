package org.example.backend.repository;

import org.example.backend.model.order.Order;
import org.example.backend.model.order.OrderResponse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrderResponseRepository extends JpaRepository<OrderResponse, Long> {
    Optional<OrderResponse> findByOrder(Order order);
}
