package org.example.backend.model.order;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.backend.model.user.User;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
public class OrderResponse { // Можно сделать так: Создать здесь два поля с buyer и seller (которые не будут сохраняться в бд) и при поиске сразу определять байера и селлера
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private User taker;
    @ManyToOne
    private Order order;
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    private LocalDateTime statusChangingTime = LocalDateTime.now();
}
