package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.DTO.OrderResponseDTO;
import org.example.backend.DTO.OrderWithStatusDTO;
import org.example.backend.model.order.OrderStatus;
import org.example.backend.model.order.OrderType;
import org.example.backend.service.OrderService;
import org.hibernate.annotations.Parameter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final OrderService orderService;

    @GetMapping("/{userId}/orders")
    public ResponseEntity<Page<OrderWithStatusDTO>> getUserOrders(
            @PathVariable Long userId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String currency,
            @RequestParam(required = false) OrderType type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int limit
    ) {

        Page<OrderWithStatusDTO> orders = orderService.getUserOrders(userId, status, currency, type, PageRequest.of(page, limit));
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }
}
