package org.example.backend.DTO;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.example.backend.model.Currency;
import org.example.backend.model.order.OrderType;
import org.example.backend.model.user.PaymentMethod;
import org.example.backend.model.user.User;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class OrderRequestDTO {
    private OrderType type; // BUY, SELL
    private String currency; // BTC, USDT ...
    private BigDecimal price; // курс валюты
    private BigDecimal amount; // количество покупаемой валюты
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;
    private long paymentMethodId;
    private String paymentDetails;
}
