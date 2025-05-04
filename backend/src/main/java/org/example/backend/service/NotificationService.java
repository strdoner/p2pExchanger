package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.DTO.NotificationCreationDTO;
import org.example.backend.model.Notification;
import org.example.backend.model.NotificationType;
import org.example.backend.model.user.User;
import org.example.backend.repository.NotificationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public Page<Notification> getUserNotifications(Long userId, Pageable paging) {
        return notificationRepository.findByUserIdOrderByReadAsc(userId, paging);
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
                notificationDTO.getUser().getId().toString(),
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
