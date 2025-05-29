package org.example.backend.DTO;

import lombok.Data;
import org.example.backend.model.Message;
import org.example.backend.model.MessageFile;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
public class MessageDTO {
    private Long id;
    private Long recipientId;
    private Long senderId;
    private Long orderResponseId;
    private String content;
    private Boolean isRead;
    private Instant createdAt;
    private List<MessageFileDTO> files;

    public MessageDTO(Message msg) {
        this.setId(msg.getId());
        this.setRecipientId(msg.getRecipient().getId());
        this.setSenderId(msg.getSender().getId());
        this.setOrderResponseId(msg.getResponse().getId());
        this.setContent(msg.getContent());
        this.setIsRead(msg.isRead());
        this.setCreatedAt(msg.getCreatedAt());
        List<MessageFileDTO> messages = new ArrayList<>();
        for (MessageFile m : msg.getFiles()) {
            messages.add(new MessageFileDTO(m));
        }
        this.setFiles(messages);
    }
}
