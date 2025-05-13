package org.example.backend.events;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.backend.model.order.OrderResponse;
import org.example.backend.model.order.OrderStatus;
import org.example.backend.model.order.OrderType;
import org.example.backend.service.BalanceService;
import org.example.backend.service.NotificationService;
import org.example.backend.service.ResponseService;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OrderResponseEventHandler {

    private final BalanceService balanceService;
    private final ResponseService responseService;
    private final NotificationService notificationService;

    @EventListener
    @Transactional
    public void handleStatusChange(OrderResponseStatusEvent event) {
        OrderResponse response = event.getResponse();
        if (event.getStatus() == OrderStatus.CANCELLED) {
            balanceService.unlockCurrency(response);
            responseService.makePendingResponse(response);
        }
        if (event.getStatus() == OrderStatus.ACTIVE) {
            if (response.getType() == OrderType.BUY)
            balanceService.lockCurrency(response);
        }
        if (event.getStatus() == OrderStatus.COMPLETED) {
            balanceService.unlockCurrency(response);
        }
        if (event.getStatus() == OrderStatus.PENDING) {
            if (response.getType() == OrderType.SELL) {
                balanceService.lockCurrency(response);
            }
        }

        if (response.getTaker() != null) {
            notificationService.notifyAboutStatusChanging(response, response.getTaker());
        }
        if (response.getMaker() != null) {
            notificationService.notifyAboutStatusChanging(response, response.getMaker());
        }
    }
}
