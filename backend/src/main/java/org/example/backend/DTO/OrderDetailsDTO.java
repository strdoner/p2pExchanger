package org.example.backend.DTO;

import lombok.Data;
import org.example.backend.model.order.OrderResponse;

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
        this.setOrderId(response.getId());
        this.setResponseId(response.getId());
        this.setMaker(new OrderDetailsUserDTO(response.getMaker()));
        this.setTaker(new OrderDetailsUserDTO(response.getTaker()));
        this.setType(response.getType().toString());
        this.setCurrency(response.getCurrency().getName());
        this.setPrice(response.getPrice());
        this.setAmount(response.getAmount());
        this.setPaymentMethod(new PaymentMethodDTO(response.getPaymentMethod()));
        this.setStatus(response.getStatus().toString());
    }
}
