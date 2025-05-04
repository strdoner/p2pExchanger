package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.model.Notification;
import org.example.backend.model.order.OrderResponse;
import org.example.backend.model.user.User;
import org.example.backend.service.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;
    @PatchMapping("/{notificationId}/read")
    public void markNotificationAsRead(@PathVariable Long notificationId) {
        notificationService.markAsRead(notificationId);
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getUserNotifications(
            @AuthenticationPrincipal User user) {

        List<Notification> notifications = notificationService
                .getUserNotifications(user.getId());

        return new ResponseEntity<>(notifications, HttpStatus.OK);
    }


}
