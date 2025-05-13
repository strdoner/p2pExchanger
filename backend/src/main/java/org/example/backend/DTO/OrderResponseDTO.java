package org.example.backend.DTO;

import lombok.Data;
import org.example.backend.model.Currency;
import org.example.backend.model.order.OrderResponse;
import org.example.backend.model.order.OrderType;
import org.example.backend.model.user.Bank;

import java.math.BigDecimal;

@Data
public class OrderResponseDTO {
    private long id;
    private UserOrderDTO maker;
    private OrderType type;
    private BigDecimal price;
    private BigDecimal amount;
    private Currency currency;
    private Bank paymentMethod;

    public OrderResponseDTO(OrderResponse response, Long ordersCount, Long percentOrdersCompleted) {
        this.id = response.getId();
        this.maker = new UserOrderDTO(response.getMaker() == null ? response.getTaker() : response.getMaker(), ordersCount, percentOrdersCompleted);
        this.type = response.getType();
        this.price = response.getPrice();
        this.amount = response.getAmount();
        this.currency = response.getCurrency();
        this.paymentMethod = response.getPaymentMethod().getBank();
    }



}