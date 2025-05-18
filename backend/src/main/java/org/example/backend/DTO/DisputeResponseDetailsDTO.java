package org.example.backend.DTO;

import lombok.Data;
import org.example.backend.model.order.Dispute;
import org.example.backend.model.order.DisputeStatus;

@Data
public class DisputeResponseDetailsDTO {
    private Long id;
    private DisputeResponseOrderDetailsDTO response;
    private DisputeStatus status;

    public DisputeResponseDetailsDTO(Dispute dispute) {
        this.setId(dispute.getId());
        this.setResponse(new DisputeResponseOrderDetailsDTO(dispute.getOrderResponse()));
        this.setStatus(dispute.getDisputeStatus());
    }
}
