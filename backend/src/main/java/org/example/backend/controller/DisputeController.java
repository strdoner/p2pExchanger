package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.DTO.DisputeResponseDetailsDTO;
import org.example.backend.DTO.DisputeResponseOrderDetailsDTO;
import org.example.backend.model.user.User;
import org.example.backend.service.DisputeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;

import java.nio.file.AccessDeniedException;

@RestController
@RequestMapping("/disputes")
@RequiredArgsConstructor
public class DisputeController {
    private final DisputeService disputeService;
    @GetMapping("/{disputeId}")
    private ResponseEntity<?> getDisputeDetails(
            @PathVariable Long disputeId,
            @AuthenticationPrincipal User user
    ) {
        try {
            DisputeResponseDetailsDTO dispute = disputeService.getDisputeById(disputeId, user);
            return new ResponseEntity<>(dispute, HttpStatus.OK);
        } catch (AccessDeniedException er) {
            return ResponseEntity.status(403).body(er.getMessage());
        }
    }
}
