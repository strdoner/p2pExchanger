package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.DTO.NotificationCreationDTO;
import org.example.backend.DTO.ResponseWebSocketDTO;
import org.example.backend.model.Notification;
import org.example.backend.model.NotificationType;
import org.example.backend.model.order.OrderResponse;
import org.example.backend.model.user.User;
import org.example.backend.repository.NotificationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByIsReadAsc(userId);
    }

    public void notifyAboutStatusChanging(OrderResponse response, User user) {
        NotificationCreationDTO notification = new NotificationCreationDTO();
        switch (response.getStatus()) {
            case ACTIVE -> notification.setMessage("На ваше объявление № "+ response.getId() +" был получен отклик");
            case CANCELLED -> notification.setMessage("Объявление № " + response.getId() + " было отменено");
            case COMPLETED -> notification.setMessage("Объявление № " + response.getId() + " было успешно завершено");
            case CONFIRMATION -> notification.setMessage("Объявление № " + response.getId() + " ожидает вашего подтверждения");
            case DISPUTED -> notification.setMessage("Объявление № " + response.getId() + " было отправлено на разбирательство");
        }
        notification.setType(NotificationType.ORDER_STATUS_CHANGE);
        notification.setTitle("Изменение статуса объявления");
        notification.setResponseId(response.getId());
        notification.setUser(user);
        createAndSendNotification(notification);

        ResponseWebSocketDTO responseWebSocketDTO = new ResponseWebSocketDTO();
        responseWebSocketDTO.setId(response.getId());
        responseWebSocketDTO.setStatus(response.getStatus().toString());
        responseWebSocketDTO.setStatusChangingTime(response.getStatusChangingTime());
        messagingTemplate.convertAndSendToUser(
                notification.getUser().getUsername(),
                "/queue/responses",
                responseWebSocketDTO
        );


    }

    public void createAndSendNotification(NotificationCreationDTO notificationDTO) {
        Notification notification = new Notification();
        notification.setType(notificationDTO.getType());
        notification.setTitle(notificationDTO.getTitle());
        notification.setMessage(notificationDTO.getMessage());
        notification.setUser(notificationDTO.getUser());
        notification.setResponseId(notificationDTO.getResponseId());

        notificationRepository.save(notification);
        System.out.printf("Sending notification to user %d via WebSocket", notification.getUser().getId());
        messagingTemplate.convertAndSendToUser(
                notificationDTO.getUser().getUsername(),
                "/queue/notifications",
                notification
        );
    }

    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

}
