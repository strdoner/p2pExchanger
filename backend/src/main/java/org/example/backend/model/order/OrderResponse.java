package org.example.backend.model.order;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.backend.model.user.User;

@Entity
@Data
@NoArgsConstructor
public class OrderResponse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private User taker;
    @ManyToOne
    private Order order;
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
}
