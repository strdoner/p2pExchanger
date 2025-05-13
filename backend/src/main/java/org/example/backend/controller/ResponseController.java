package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.DTO.OrderDetailsDTO;
import org.example.backend.DTO.OrderRequestDTO;
import org.example.backend.DTO.OrderResponseDTO;
import org.example.backend.model.order.OrderResponse;
import org.example.backend.model.user.User;
import org.example.backend.service.ResponseService;
import org.example.backend.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/responses")
@RequiredArgsConstructor
public class ResponseController {

    private final ResponseService responseService;
    private final UserService userService;
    private final SimpMessagingTemplate messagingTemplate;

    @GetMapping
    public ResponseEntity<Page<OrderResponseDTO>> getAllResponses(
            @RequestParam(defaultValue = "USDT") String coin,
            @RequestParam(required = false) String method,
            @RequestParam(defaultValue = "BUY") String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int limit,
            @AuthenticationPrincipal User user
    ) {

        final Page<OrderResponseDTO> orders = responseService.getPendingResponses(method, coin, type, user, PageRequest.of(page, limit));
        return new ResponseEntity<>(orders, HttpStatus.OK);

    }

    @PostMapping
    public ResponseEntity<?> createOrderResponse(
            @RequestBody OrderRequestDTO orderDTO,
            @AuthenticationPrincipal User user
    ) {
        try {
            responseService.createResponse(orderDTO, user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

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

    @PostMapping("/{id}/accept")
    public ResponseEntity<?> acceptOrder(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) throws Exception {
        OrderDetailsDTO response = responseService.makeActiveResponse(
                id,
                user
        );

        return new ResponseEntity<>(response, HttpStatus.CREATED);
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
