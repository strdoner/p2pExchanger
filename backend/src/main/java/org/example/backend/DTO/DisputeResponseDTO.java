package org.example.backend.DTO;

import lombok.Data;
import org.example.backend.model.order.Dispute;
import org.example.backend.model.order.DisputeStatus;

@Data
public class DisputeResponseDTO {
    private Long id;
    private DisputeResponseOrderDTO response;
    private DisputeStatus status;

    public DisputeResponseDTO(Dispute dispute) {
        this.setId(dispute.getId());
        this.setResponse(new DisputeResponseOrderDTO(dispute.getOrderResponse()));
        this.setStatus(dispute.getDisputeStatus());
    }
}
