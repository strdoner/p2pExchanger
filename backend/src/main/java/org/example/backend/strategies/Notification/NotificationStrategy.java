package org.example.backend.strategies.Notification;

import org.example.backend.DTO.NotificationCreationDTO;
import org.example.backend.model.order.OrderResponse;
import org.example.backend.model.order.OrderStatus;

public interface NotificationStrategy {
    NotificationCreationDTO createNotification(OrderResponse response);
    OrderStatus getStatus();
}
