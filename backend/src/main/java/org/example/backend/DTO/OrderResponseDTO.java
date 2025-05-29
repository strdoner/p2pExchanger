package org.example.backend.DTO;

import lombok.Data;
import org.example.backend.model.Currency;
import org.example.backend.model.order.Order;
import org.example.backend.model.order.OrderType;
import org.example.backend.model.user.Bank;
import org.example.backend.service.OrderService;

import java.math.BigDecimal;

@Data
public class OrderResponseDTO {
    private long id;
    private UserOrderDTO maker;
    private OrderType type;
    private BigDecimal price;
    private BigDecimal amount;
    private Currency currency;
    private String paymentDetails;
    private Bank paymentMethod;
    private Bank preferredBank;

    public OrderResponseDTO(Order order, Long ordersCount, Long percentOrdersCompleted) {
        this.id = order.getId();
        this.maker = new UserOrderDTO(order.getMaker(), ordersCount, percentOrdersCompleted);
        this.type = order.getType();
        this.price = order.getPrice();
        this.amount = order.getAmount();
        this.currency = order.getCurrency();
        this.paymentMethod = order.getPaymentMethod() == null ? order.getPreferredBank() : order.getPaymentMethod().getBank();
        this.paymentDetails = order.getPaymentDetails();
    }



}