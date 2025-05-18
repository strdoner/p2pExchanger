package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.example.backend.DTO.DisputeResponseDTO;
import org.example.backend.DTO.OrderResponseDTO;
import org.example.backend.model.order.OrderResponse;
import org.example.backend.model.order.OrderStatus;
import org.example.backend.model.user.User;
import org.example.backend.service.DisputeService;
import org.example.backend.service.ResponseService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
    private final DisputeService disputeService;

    @GetMapping
    public ResponseEntity<?> check() {
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/disputes")
    public ResponseEntity<Page<DisputeResponseDTO>> getDisputes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "5") int limit
    ) {
        final Page<DisputeResponseDTO> responses = disputeService.getDisputes(status, PageRequest.of(page, limit));
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @PostMapping("/disputes/{disputeId}/complete")
    public ResponseEntity<?> completeDispute(
            @AuthenticationPrincipal User user,
            @RequestBody String comment,
            @PathVariable Long disputeId
    ) {
        try {
            disputeService.completeDispute(disputeId, comment);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/disputes/{disputeId}/cancel")
    public ResponseEntity<?> cancelDispute(
            @AuthenticationPrincipal User user,
            @RequestBody String comment,
            @PathVariable Long disputeId
    ) {
        try {
            disputeService.cancelDispute(disputeId, comment);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }


}
