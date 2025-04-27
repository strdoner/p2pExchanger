package org.example.backend.DTO;

import lombok.Data;
import org.example.backend.model.Currency;
import org.example.backend.model.order.Order;
import org.example.backend.model.order.OrderType;
import org.example.backend.model.user.User;

import java.math.BigDecimal;

@Data
public class OrderResponseDTO {
    private long id;
    private User maker;
    private OrderType type;
    private BigDecimal price;
    private BigDecimal amount;
    private Currency currency;
    private BigDecimal minLimit;
    private BigDecimal maxLimit;
    private String paymentMethod;

    public OrderResponseDTO(Order order) {
        this.id = order.getId();
        this.maker = order.getMaker();
        this.type = order.getType();
        this.price = order.getPrice();
        this.amount = order.getAmount();
        this.currency = order.getCurrency();
        this.minLimit = order.getMinLimit();
        this.maxLimit = order.getMaxLimit();
        this.paymentMethod = order.getPaymentMethod().getBank().getName();
    }
    // Геттеры



}