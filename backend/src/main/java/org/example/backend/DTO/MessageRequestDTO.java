package org.example.backend.DTO;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class MessageRequestDTO {
    private Long recipientId;
    private Long senderId;
    private Long orderResponseId;
    private String content;

}
