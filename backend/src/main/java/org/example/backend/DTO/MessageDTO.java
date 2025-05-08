package org.example.backend.DTO;

import lombok.Data;
import org.example.backend.model.Message;

import java.time.Instant;
@Data
public class MessageDTO {
    private Long id;
    private Long recipientId;
    private Long senderId;
    private Long orderResponseId;
    private String content;
    private Boolean isRead;
    private Instant createdAt;

    public MessageDTO(Message msg) {
        this.setId(msg.getId());
        this.setRecipientId(msg.getRecipient().getId());
        this.setSenderId(msg.getSender().getId());
        this.setOrderResponseId(msg.getResponse().getId());
        this.setContent(msg.getContent());
        this.setIsRead(msg.isRead());
        this.setCreatedAt(msg.getCreatedAt());
    }
}
