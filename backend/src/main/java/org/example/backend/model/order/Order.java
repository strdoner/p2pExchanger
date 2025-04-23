package org.example.backend.model.order;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.model.Currency;
import org.example.backend.model.user.PaymentMethod;
import org.example.backend.model.user.User;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name="orders")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maker_id", nullable = false)
    private User maker; // создает

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "taker_id", nullable = false)
    private User taker; // откликается

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderType type; // BUY, SELL

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

    @ManyToOne
    private PaymentMethod paymentMethod;

    @Column(length = 500)
    private String paymentDetails;


}
