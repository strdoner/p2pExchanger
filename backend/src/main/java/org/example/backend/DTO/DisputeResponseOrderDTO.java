package org.example.backend.DTO;

import lombok.Data;
import org.example.backend.model.order.OrderResponse;
import org.example.backend.service.OrderService;
import org.example.backend.service.ResponseService;

import java.math.BigDecimal;

@Data
public class DisputeResponseOrderDTO {
    private Long id;
    private BigDecimal amount;
    private String currency;
    private OrderDetailsUserDTO buyer;
    private OrderDetailsUserDTO seller;

    public DisputeResponseOrderDTO(OrderResponse response) {
        this.setId(response.getId());
        this.setAmount(response.getOrder().getAmount());
        this.setCurrency(response.getOrder().getCurrency().getShortName());
        this.setBuyer(new OrderDetailsUserDTO(ResponseService.isBuyer(response, response.getTaker()) ? response.getTaker(): response.getOrder().getMaker()));
        this.setSeller(new OrderDetailsUserDTO(ResponseService.isSeller(response, response.getTaker()) ? response.getTaker(): response.getOrder().getMaker()));
    }
}
