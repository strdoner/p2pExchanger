package org.example.backend.DTO;

import lombok.Data;

@Data
public class MessageRequestDTO {
    private Long recipientId;
    private Long senderId;
    private Long orderResponseId;
    private String content;


}
