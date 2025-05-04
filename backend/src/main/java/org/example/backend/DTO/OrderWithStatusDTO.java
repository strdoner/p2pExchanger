package org.example.backend.DTO;

import lombok.Data;
import org.example.backend.model.Currency;
import org.example.backend.model.order.Order;
import org.example.backend.model.order.OrderStatus;
import org.example.backend.model.order.OrderType;
import org.example.backend.model.user.User;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class OrderWithStatusDTO {
    private long id;
    private long responseId;
    private OrderType type;
    private BigDecimal price;
    private BigDecimal amount;
    private Currency currency;
    private String createdAt;
    private String contragentName;
    private Long contragentId;
    private OrderStatus status;

    public OrderWithStatusDTO(Order order, OrderStatus status, long responseId, User contragent) {
        this.setId(order.getId());
        this.setResponseId(responseId);
        this.setType(order.getType());
        this.setPrice(order.getPrice());
        this.setAmount(order.getAmount());
        this.setCurrency(order.getCurrency());
        this.setCreatedAt(order.getCreatedAt().toString());
        this.setContragentId(contragent.getId());
        this.setContragentName(contragent.getUsername());
        this.setStatus(status);
    }
}
