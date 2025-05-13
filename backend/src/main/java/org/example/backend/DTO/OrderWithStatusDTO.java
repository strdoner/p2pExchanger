package org.example.backend.DTO;

import lombok.Data;
import org.example.backend.model.Currency;
import org.example.backend.model.order.OrderResponse;
import org.example.backend.model.order.OrderStatus;
import org.example.backend.model.order.OrderType;
import org.example.backend.model.user.User;

import java.math.BigDecimal;

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

    public OrderWithStatusDTO(OrderResponse response, User contragent) {
        this.setId(response.getId());
        this.setResponseId(response.getId());
        this.setType(response.getType());
        this.setPrice(response.getPrice());
        this.setAmount(response.getAmount());
        this.setCurrency(response.getCurrency());
        this.setCreatedAt(response.getCreatedAt().toString());
        this.setContragentId(contragent.getId());
        this.setContragentName(contragent.getUsername());
        this.setStatus(response.getStatus());
    }
}
