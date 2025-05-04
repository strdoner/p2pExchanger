package org.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.example.backend.model.user.User;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Data
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private NotificationType type;

    @Column(nullable = false, length = 100)
    private String title;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    private boolean isRead = false;
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    private Long responseId;
}
