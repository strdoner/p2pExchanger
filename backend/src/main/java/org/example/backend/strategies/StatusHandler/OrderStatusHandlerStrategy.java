package org.example.backend.strategies.StatusHandler;

import org.example.backend.model.order.OrderResponse;
import org.example.backend.model.order.OrderStatus;

public interface OrderStatusHandlerStrategy {
    void handle(OrderResponse response);
    OrderStatus getStatus();
}
