package org.example.backend.model.order;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.DTO.OrderRequestDTO;
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

    @ManyToOne
    @JoinColumn(name = "maker_id", nullable = false)
    private User maker; // создает

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderType type; // BUY, SELL

     // ACTIVE, COMPLETED, CANCELLED
    @ManyToOne
    @JoinColumn(name = "currency_id", nullable = false)
    private Currency currency; // BTC, USDT ...

    @Column(precision = 19, scale = 2, nullable = false)
    private BigDecimal price; // курс валюты

    @Column(precision = 19, scale = 8, nullable = false)
    private BigDecimal amount; // количество покупаемой валюты

    @Column(nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt = LocalDateTime.now();
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    @JsonIgnore
    @ManyToOne
    private PaymentMethod paymentMethod;

    @Column(length = 500)
    private String paymentDetails;

    private Boolean isAvailable = true;


    public void copyFrom(OrderRequestDTO order) {
        this.setAmount(order.getAmount());
        this.setType(order.getType());
        this.setPrice(order.getPrice());
        this.setPaymentDetails(order.getPaymentDetails());
    }
}
