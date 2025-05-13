package org.example.backend.model.order;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.backend.DTO.OrderRequestDTO;
import org.example.backend.model.Currency;
import org.example.backend.model.user.PaymentMethod;
import org.example.backend.model.user.User;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

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
    private User maker;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderType type; // BUY, SELL

    @Column(precision = 19, scale = 2, nullable = false)
    private BigDecimal price; // курс валюты

    @Column(precision = 19, scale = 8, nullable = false)
    private BigDecimal amount; // количество покупаемой валюты

    @ManyToOne
    @JoinColumn(name = "currency_id", nullable = false)
    private Currency currency; // BTC, USDT ...

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @Column(nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt = LocalDateTime.now();

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime statusChangingTime = LocalDateTime.now();

    @JsonIgnore
    @ManyToOne
    private PaymentMethod paymentMethod;

    @Column(length = 500)
    private String paymentDetails;


//    private Boolean isAvailable = true; ---- ??

    public void copyFrom(OrderRequestDTO dto) {
        this.setType(dto.getType());
        this.setPrice(dto.getPrice());
        this.setAmount(dto.getAmount());

    }

}
