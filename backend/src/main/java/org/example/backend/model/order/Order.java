package org.example.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name="order")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderType type; // BUY or SELL

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.ACTIVE; // ACTIVE, COMPLETED, CANCELLED

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Currency currency; // BTC, USDT ...

    @Column(precision = 19, scale = 2, nullable = false)
    private BigDecimal price; // курс валюты

    @Column(precision = 19, scale = 2)
    private BigDecimal minLimit; // минимальная граница

    @Column(precision = 19, scale = 2)
    private BigDecimal maxLimit; // максимальная граница

    @Column(precision = 19, scale = 8, nullable = false)
    private BigDecimal amount; // количество покупаемой валюты

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;

    @Column(length = 500)
    private String paymentDetails;
}
