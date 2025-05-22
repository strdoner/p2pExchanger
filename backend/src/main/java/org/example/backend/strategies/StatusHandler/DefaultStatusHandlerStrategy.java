package org.example.backend.strategies.StatusHandler;

import lombok.RequiredArgsConstructor;
import org.example.backend.model.order.OrderResponse;
import org.example.backend.model.order.OrderStatus;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DefaultStatusHandlerStrategy implements OrderStatusHandlerStrategy{
    @Override
    public void handle(OrderResponse response) {

    }

    @Override
    public OrderStatus getStatus() {
        return null;
    }
}
