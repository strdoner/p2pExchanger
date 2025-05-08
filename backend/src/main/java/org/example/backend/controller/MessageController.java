package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.DTO.MessageDTO;
import org.example.backend.DTO.MessageRequestDTO;
import org.example.backend.model.Message;
import org.example.backend.model.Notification;
import org.example.backend.model.user.User;
import org.example.backend.service.MessageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
public class MessageController {
    private final MessageService messageService;


    @GetMapping("/response/{responseId}")
    public ResponseEntity<List<MessageDTO>> getResponseMessages(
            @AuthenticationPrincipal User user,
            @PathVariable Long responseId
    ) {

        List<MessageDTO> messages = messageService
                .getResponseMessages(user, responseId);
        if (messages == null) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        return new ResponseEntity<>(messages, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> sendMessage(
            @RequestBody MessageRequestDTO dto,
            @AuthenticationPrincipal User user

    ) {
        MessageDTO message;
        try {
            message = messageService.createAndSendMessage(user, dto);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        if (message == null) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        return new ResponseEntity<>(message, HttpStatus.CREATED);
    }


}
