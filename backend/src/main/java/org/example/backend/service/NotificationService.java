package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.DTO.NotificationCreationDTO;
import org.example.backend.DTO.ResponseWebSocketDTO;
import org.example.backend.model.Notification;
import org.example.backend.model.NotificationType;
import org.example.backend.model.order.OrderResponse;
import org.example.backend.model.order.OrderStatus;
import org.example.backend.model.user.User;
import org.example.backend.repository.NotificationRepository;
import org.example.backend.strategies.Notification.NotificationStrategy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final List<NotificationStrategy> strs;
    private final Map<OrderStatus, NotificationStrategy> strategies = new HashMap<>();

    @PostConstruct
    public void init() {
        for (NotificationStrategy str : strs) {
            strategies.put(str.getStatus(), str);
        }
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByIsReadAsc(userId);
    }

    public void notifyAboutStatusChanging(OrderResponse response, User user, OrderStatus status) {
        NotificationStrategy strategy = strategies.get(status);
        if (strategy == null) {
            throw new IllegalStateException();
        }
        NotificationCreationDTO notification = strategy.createNotification(response);
        notification.setUser(user);
        createAndSendNotification(notification);

        ResponseWebSocketDTO responseWebSocketDTO = new ResponseWebSocketDTO();
        responseWebSocketDTO.setId(response.getId());
        responseWebSocketDTO.setStatus(status.toString());
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
