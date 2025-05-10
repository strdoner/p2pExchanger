package org.example.backend.DTO;

import lombok.Data;
import org.example.backend.model.order.Order;
import org.example.backend.model.order.OrderResponse;
import org.example.backend.model.order.OrderStatus;
import org.example.backend.model.user.PaymentMethod;
import org.example.backend.model.user.User;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class OrderDetailsDTO {
    private long orderId;
    private long responseId;
    private OrderDetailsUserDTO maker;
    private OrderDetailsUserDTO taker;
    private String type;
    private String currency;
    private BigDecimal price;
    private BigDecimal amount;
    private PaymentMethodDTO paymentMethod;
    private String status;
    private LocalDateTime statusChangingTime;


    public OrderDetailsDTO(OrderResponse response) throws Exception {
        this.setStatusChangingTime(response.getStatusChangingTime());
        this.setOrderId(response.getOrder().getId());
        this.setResponseId(response.getId());
        this.setMaker(new OrderDetailsUserDTO(response.getOrder().getMaker()));
        this.setTaker(new OrderDetailsUserDTO(response.getTaker()));
        this.setType(response.getOrder().getType().toString());
        this.setCurrency(response.getOrder().getCurrency().getName());
        this.setPrice(response.getOrder().getPrice());
        this.setAmount(response.getOrder().getAmount());
        this.setPaymentMethod(new PaymentMethodDTO(response.getOrder().getPaymentMethod()));
        this.setStatus(response.getStatus().toString());
    }
}
