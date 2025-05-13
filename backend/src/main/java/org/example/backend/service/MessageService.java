package org.example.backend.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.example.backend.DTO.MessageDTO;
import org.example.backend.DTO.MessageRequestDTO;
import org.example.backend.DTO.OrderResponseDTO;
import org.example.backend.model.Message;
import org.example.backend.model.Notification;
import org.example.backend.model.order.OrderResponse;
import org.example.backend.model.order.OrderStatus;
import org.example.backend.model.user.User;
import org.example.backend.repository.MessageRepository;
import org.example.backend.repository.OrderResponseRepository;
import org.example.backend.repository.UserRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final OrderResponseRepository orderResponseRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public List<MessageDTO> getResponseMessages(User user, Long responseId) {
        OrderResponse orderResponse = orderResponseRepository.findById(responseId).orElseThrow(
                EntityNotFoundException::new
        );
        if (!Objects.equals(user.getId(), orderResponse.getTaker().getId()) && !Objects.equals(user.getId(), orderResponse.getMaker().getId())) {
            return null;
        }
        List<Message> messages = messageRepository.findAllByResponseId(responseId);
        List<MessageDTO> messagesDTO = new ArrayList<>();

        for (Message message : messages) {
            messagesDTO.add(new MessageDTO(message));
        }

        return messagesDTO;

    }

    public MessageDTO createAndSendMessage(User user, MessageRequestDTO messageRequestDTO) {
        if (!Objects.equals(user.getId(), messageRequestDTO.getSenderId())) {
            throw new AccessDeniedException("Sender ID doesn't match authenticated user");
        }

        if (messageRequestDTO.getSenderId().equals(messageRequestDTO.getRecipientId())) {
            throw new IllegalArgumentException("Cannot send message to yourself");
        }

        OrderResponse orderResponse = orderResponseRepository.findById(messageRequestDTO.getOrderResponseId()).orElseThrow(
                EntityNotFoundException::new
        );
        if ((!Objects.equals(orderResponse.getTaker().getId(), messageRequestDTO.getSenderId()) &&
                !Objects.equals(orderResponse.getTaker().getId(), messageRequestDTO.getRecipientId())) ||
            (!Objects.equals(orderResponse.getMaker().getId(), messageRequestDTO.getSenderId()) &&
                !Objects.equals(orderResponse.getMaker().getId(), messageRequestDTO.getRecipientId()))
        ) {
            throw new IllegalArgumentException();
        }
        Message message = new Message();
        message.setContent(messageRequestDTO.getContent());
        message.setRead(message.isRead());
        message.setRecipient(userRepository.getReferenceById(messageRequestDTO.getRecipientId()));
        message.setSender(userRepository.getReferenceById(messageRequestDTO.getSenderId()));
        message.setResponse(orderResponse);

        message = messageRepository.save(message);
        MessageDTO messageDTO = new MessageDTO(message);
        System.out.printf("Sending message to user %d via WebSocket", message.getRecipient().getId());
        messagingTemplate.convertAndSendToUser(
                userRepository.getReferenceById(messageDTO.getRecipientId()).getUsername(),
                "/queue/messages",
                messageDTO
        );

        return messageDTO;
    }

}
