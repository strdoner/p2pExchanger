package org.example.backend.strategies.StatusHandler;

import lombok.RequiredArgsConstructor;
import org.example.backend.model.order.OrderResponse;
import org.example.backend.model.order.OrderStatus;
import org.example.backend.service.BalanceService;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ActiveStatusHandlerStrategy implements OrderStatusHandlerStrategy {
    private final BalanceService balanceService;

    @Override
    public void handle(OrderResponse response) {
        balanceService.lockCurrency(response);
    }

    @Override
    public OrderStatus getStatus() {
        return OrderStatus.ACTIVE;
    }
}
