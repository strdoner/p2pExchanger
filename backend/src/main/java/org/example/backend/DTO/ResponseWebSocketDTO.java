package org.example.backend.DTO;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ResponseWebSocketDTO {
    private Long id;
    private String status;
    private LocalDateTime statusChangingTime;
}
