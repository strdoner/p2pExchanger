package org.example.backend.DTO;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import lombok.Data;
import org.example.backend.model.Currency;
import org.example.backend.model.order.OrderType;
import org.example.backend.model.user.PaymentMethod;
import org.example.backend.model.user.User;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class OrderRequestDTO {
    public static interface New {

    }

    public static interface Update {

    }

    @NotNull(groups = {New.class})
    @Null(groups = {Update.class})
    private OrderType type; // BUY, SELL

    @NotNull(groups = {New.class})
    private String currency; // BTC, USDT ...

    @Min(1)
    private BigDecimal price; // курс валюты
    @Min(1)
    private BigDecimal amount; // количество покупаемой валюты

    private LocalDateTime createdAt = LocalDateTime.now();
    @Null(groups = {New.class, Update.class})
    private LocalDateTime updatedAt;

    private long paymentMethodId;
    private String preferredBank;

    private String paymentDetails;
}
