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

@RestController
@RequestMapping("/responses")
@RequiredArgsConstructor
public class ResponseController {

    private final ResponseService responseService;
    private final UserService userService;
    private final SimpMessagingTemplate messagingTemplate;

    @GetMapping("/{id}")
    public ResponseEntity<?> getResponseById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
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
            @AuthenticationPrincipal User user) {
        OrderResponse details = responseService.cancelResponse(id, user);

        return details == null
            ? new ResponseEntity<>(HttpStatus.FORBIDDEN)
            : new ResponseEntity<>(details, HttpStatus.OK);
    }

    @PatchMapping("/{id}/confirm")
    public ResponseEntity<?> confirmResponse(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        OrderResponse details = responseService.confirmResponse(id, user);
        return details == null
                ? new ResponseEntity<>(HttpStatus.FORBIDDEN)
                : new ResponseEntity<>(details, HttpStatus.OK);
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<?> completeResponse(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        OrderResponse details = responseService.completeResponse(id, user);
        return details == null
                ? new ResponseEntity<>(HttpStatus.FORBIDDEN)
                : new ResponseEntity<>(details, HttpStatus.OK);
    }


}
