package org.example.backend.strategies.Notification;

import org.example.backend.DTO.NotificationCreationDTO;
import org.example.backend.model.NotificationType;
import org.example.backend.model.order.OrderResponse;
import org.example.backend.model.order.OrderStatus;
import org.springframework.stereotype.Component;

@Component
public class CancelledNotificationStrategy implements NotificationStrategy{
    @Override
    public NotificationCreationDTO createNotification(OrderResponse response) {
        NotificationCreationDTO notification = new NotificationCreationDTO();
        notification.setMessage("Объявление № " + response.getId() + " было отменено");
        notification.setType(NotificationType.ORDER_STATUS_CHANGE);
        notification.setTitle("Изменение статуса объявления");
        notification.setResponseId(response.getId());
        return notification;
    }

    @Override
    public OrderStatus getStatus() {
        return OrderStatus.CANCELLED;
    }
}
