package org.example.backend.events;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.backend.model.order.Order;
import org.example.backend.model.order.OrderResponse;
import org.example.backend.model.order.OrderStatus;
import org.example.backend.model.order.OrderType;
import org.example.backend.service.*;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OrderResponseEventHandler {

    private final BalanceService balanceService;
    private final OrderService orderService;
    private final NotificationService notificationService;
    private final DisputeService disputeService;

    @EventListener
    @Transactional
    public void handleStatusChange(OrderResponseStatusEvent event) {
        Order order = event.getResponse().getOrder();
        OrderResponse response = event.getResponse();
        if (event.getStatus() == OrderStatus.CANCELLED) {
            orderService.makeOrderAvailable(order);
        }
        if (event.getStatus() == OrderStatus.ACTIVE) {
            balanceService.lockCurrency(response);
        }
        if (event.getStatus() == OrderStatus.COMPLETED) {
            balanceService.unlockCurrency(response);
        }
        if (event.getStatus() == OrderStatus.DISPUTED) {
            disputeService.create(response);
        }

        notificationService.notifyAboutStatusChanging(response, response.getTaker());
        notificationService.notifyAboutStatusChanging(response, response.getOrder().getMaker());
    }
}
