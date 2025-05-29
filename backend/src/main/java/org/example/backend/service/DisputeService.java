package org.example.backend.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.example.backend.DTO.DisputeResponseDTO;
import org.example.backend.DTO.DisputeResponseDetailsDTO;
import org.example.backend.DTO.DisputeResponseOrderDetailsDTO;
import org.example.backend.events.OrderEvent;
import org.example.backend.model.order.Dispute;
import org.example.backend.model.order.DisputeStatus;
import org.example.backend.model.order.OrderResponse;
import org.example.backend.model.order.OrderStatus;
import org.example.backend.model.user.User;
import org.example.backend.repository.DisputeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class DisputeService {
    private final DisputeRepository disputeRepository;
    private final ResponseService responseService;

    public void create(OrderResponse response) {
        Dispute dispute = new Dispute();
        dispute.setDisputeStatus(DisputeStatus.OPEN);
        dispute.setOrderResponse(response);
        disputeRepository.save(dispute);
    }

    public Page<DisputeResponseDTO> getDisputes(String status, Pageable paging) {
        Page<Dispute> disputes;
        if (status == null) {
            disputes = disputeRepository.findAll(paging);
        }
        else {
            disputes = disputeRepository.findAllByDisputeStatus(DisputeStatus.fromString(status), paging);
        }

        return disputes.map(dispute -> {
            try {
                return new DisputeResponseDTO(dispute);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        });
    }

    public DisputeResponseDetailsDTO getDisputeById(Long disputeId, User user) throws AccessDeniedException {
        Dispute dispute = disputeRepository.findById(disputeId).orElseThrow(
                EntityNotFoundException::new
        );
        if (
                Objects.equals(user.getRole().getName(), "ROLE_ADMIN") ||
                        Objects.equals(dispute.getOrderResponse().getTaker().getId(), user.getId()) ||
                        Objects.equals(dispute.getOrderResponse().getOrder().getMaker().getId(), user.getId())
        ) {
            return new DisputeResponseDetailsDTO(dispute);
        }

        throw new AccessDeniedException("У вас недостаточно прав!");
    }

    public Long getDisputeIdByOrderResponse(OrderResponse orderResponse) {
        return disputeRepository.findByOrderResponse(orderResponse).getId();
    }

    public void completeDispute(Long disputeId, String comment, User user) {
        Dispute dispute = disputeRepository.findById(disputeId).orElseThrow(
                EntityNotFoundException::new
        );
        dispute.setResolution(comment);
        dispute.setResolvedAt(LocalDateTime.now());
        dispute.setDisputeStatus(DisputeStatus.RESOLVED);
        disputeRepository.save(dispute);

        responseService.changeStatusByAdmin(dispute.getOrderResponse(), OrderEvent.COMPLETE, user);

    }

    public void cancelDispute(Long disputeId, String comment, User user) {
        Dispute dispute = disputeRepository.findById(disputeId).orElseThrow(
                EntityNotFoundException::new
        );
        dispute.setResolution(comment);
        dispute.setResolvedAt(LocalDateTime.now());
        dispute.setDisputeStatus(DisputeStatus.RESOLVED);
        disputeRepository.save(dispute);
        responseService.changeStatusByAdmin(dispute.getOrderResponse(), OrderEvent.CANCEL, user);
    }
}
