package org.example.backend.repository;

import org.example.backend.model.order.Order;
import org.example.backend.model.order.OrderResponse;
import org.example.backend.model.order.OrderStatus;
import org.example.backend.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrderResponseRepository extends JpaRepository<OrderResponse, Long> {
    Optional<OrderResponse> findByOrder(Order order);

    Long countByTaker(User user);

    Long countByTakerAndStatus(User taker, OrderStatus status);
    Long countByOrder_MakerAndStatus(User user, OrderStatus status);
}
