package org.example.backend.events;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.backend.model.order.Order;
import org.example.backend.model.order.OrderResponse;
import org.example.backend.model.order.OrderStatus;
import org.example.backend.model.order.OrderType;
import org.example.backend.service.*;
import org.example.backend.strategies.StatusHandler.DefaultStatusHandlerStrategy;
import org.example.backend.strategies.StatusHandler.OrderStatusHandlerStrategy;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OrderResponseEventHandler {

    private final NotificationService notificationService;


    private final List<OrderStatusHandlerStrategy> strs;
    private final Map<OrderStatus, OrderStatusHandlerStrategy> strategies = new HashMap<>();
    private final OrderStatusHandlerStrategy defaultStrategy = new DefaultStatusHandlerStrategy();

    @PostConstruct
    public void init() {
        for (OrderStatusHandlerStrategy str : strs) {
            if (str.getStatus() != null) {
                strategies.put(str.getStatus(), str);
            }
        }
    }

    @EventListener
    @Transactional
    public void handleStatusChange(OrderResponseStatusEvent event) {
        OrderResponse response = event.getResponse();
        OrderStatus status = event.getStatus();
        System.out.println("Статус - " + event.getStatus().toString());

        OrderStatusHandlerStrategy strategy = strategies.getOrDefault(status, defaultStrategy);
        strategy.handle(response);
        if (status == OrderStatus.ACTIVE) {
            notificationService.notifyAboutStatusChanging(response, response.getOrder().getMaker(), event.getStatus());

        }
        else {
            notificationService.notifyAboutStatusChanging(response, response.getTaker(), event.getStatus());
            notificationService.notifyAboutStatusChanging(response, response.getOrder().getMaker(), event.getStatus());
        }
    }
}
