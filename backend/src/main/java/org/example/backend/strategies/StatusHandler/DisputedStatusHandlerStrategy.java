package org.example.backend.strategies.StatusHandler;

import lombok.RequiredArgsConstructor;
import org.example.backend.model.order.OrderResponse;
import org.example.backend.model.order.OrderStatus;
import org.example.backend.service.DisputeService;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DisputedStatusHandlerStrategy implements OrderStatusHandlerStrategy {
    private final DisputeService disputeService;


    @Override
    public void handle(OrderResponse response) {
        disputeService.create(response);
    }

    @Override
    public OrderStatus getStatus() {
        return OrderStatus.DISPUTED;
    }
}
