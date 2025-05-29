package org.example.backend.DTO;

import lombok.Data;
import org.example.backend.model.order.OrderResponse;
import org.example.backend.service.ResponseService;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class DisputeResponseOrderDetailsDTO {
    private Long id;
    private BigDecimal amount;
    private String currency;
    private OrderDetailsUserDTO buyer;
    private OrderDetailsUserDTO seller;
    private EncryptedPaymentMethodDTO paymentMethod;
    private BigDecimal price;
    private String orderCreatedAt;
    private String disputeStartedAt;

    public DisputeResponseOrderDetailsDTO(OrderResponse response) {
        this.setId(response.getId());
        this.setAmount(response.getOrder().getAmount());
        this.setCurrency(response.getOrder().getCurrency().getShortName());
        this.setBuyer(new OrderDetailsUserDTO(ResponseService.isBuyer(response, response.getTaker()) ? response.getTaker(): response.getOrder().getMaker()));
        this.setSeller(new OrderDetailsUserDTO(ResponseService.isSeller(response, response.getTaker()) ? response.getTaker(): response.getOrder().getMaker()));
        this.setPrice(response.getOrder().getPrice());
        this.setPaymentMethod(new EncryptedPaymentMethodDTO(response.getOrder().getPaymentMethod()));
        this.setOrderCreatedAt(response.getOrder().getCreatedAt().toString());
        this.setDisputeStartedAt(response.getStatusChangingTime().toString());
    }
}
