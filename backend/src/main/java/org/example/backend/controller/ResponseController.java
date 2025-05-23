package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.DTO.OrderDetailsDTO;
import org.example.backend.DTO.ResponseWebSocketDTO;
import org.example.backend.model.order.Order;
import org.example.backend.model.order.OrderResponse;
import org.example.backend.model.user.User;
import org.example.backend.service.ResponseService;
import org.example.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;

@RestController
@RequestMapping("/responses")
@RequiredArgsConstructor
public class ResponseController {

    private final ResponseService responseService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getResponseById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) throws Exception {
        OrderResponse response = responseService.read(user, id);
        if (response == null) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        OrderDetailsDTO details = new OrderDetailsDTO(response);
        return new ResponseEntity<>(details, HttpStatus.OK);

    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<?> cancelResponse(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) throws AccessDeniedException {
        return new ResponseEntity<>(responseService.cancelResponse(id, user), HttpStatus.OK);
    }

    @PatchMapping("/{id}/confirm")
    public ResponseEntity<?> confirmResponse(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) throws AccessDeniedException {
        return new ResponseEntity<>(responseService.confirmResponse(id, user), HttpStatus.OK);
    }

    @PatchMapping("/{id}/dispute")
    public ResponseEntity<?> disputeResponse(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) throws AccessDeniedException {
        return new ResponseEntity<>(responseService.createDispute(id, user), HttpStatus.OK);
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<?> completeResponse(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) throws AccessDeniedException {
        return new ResponseEntity<>(responseService.completeResponse(id, user), HttpStatus.OK);
    }


}
