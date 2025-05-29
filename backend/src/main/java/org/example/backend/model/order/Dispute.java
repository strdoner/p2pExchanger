package org.example.backend.model.order;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Dispute {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private OrderResponse orderResponse;

    @Enumerated(EnumType.STRING)
    private DisputeStatus disputeStatus;

    private String resolution;
    private LocalDateTime resolvedAt;
}
