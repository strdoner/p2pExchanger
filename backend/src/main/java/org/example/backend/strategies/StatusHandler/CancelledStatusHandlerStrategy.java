package org.example.backend.strategies.StatusHandler;

import lombok.RequiredArgsConstructor;
import org.example.backend.model.order.OrderResponse;
import org.example.backend.model.order.OrderStatus;
import org.example.backend.service.OrderService;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CancelledStatusHandlerStrategy implements OrderStatusHandlerStrategy {
    private final OrderService orderService;

    @Override
    public void handle(OrderResponse response) {
        orderService.makeOrderAvailable(response.getOrder());
    }

    @Override
    public OrderStatus getStatus() {
        return OrderStatus.CANCELLED;
    }
}
