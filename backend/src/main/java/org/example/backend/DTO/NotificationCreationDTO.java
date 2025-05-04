package org.example.backend.DTO;

import lombok.Data;
import org.example.backend.model.NotificationType;
import org.example.backend.model.user.User;

@Data
public class NotificationCreationDTO {
    private User user;
    private NotificationType type;
    private String title;
    private String message;
    private Long responseId;
}
