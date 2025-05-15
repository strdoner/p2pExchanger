package org.example.backend.controller;


import org.example.backend.DTO.*;
import org.example.backend.exception.InsufficientBalanceException;
import org.example.backend.model.order.Order;
import org.example.backend.model.order.OrderResponse;
import org.example.backend.model.order.OrderType;
import org.example.backend.model.user.User;
import org.example.backend.service.OrderService;
import org.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {
    private final OrderService orderService;
    private final UserService userService;

    @Autowired
    public OrderController(OrderService orderService, UserService userService) {
        this.orderService = orderService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<Page<OrderResponseDTO >> getAllOrders(
            @RequestParam(defaultValue = "USDT") String coin,
            @RequestParam(required = false) String method,
            @RequestParam(defaultValue = "BUY") String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int limit,
            @AuthenticationPrincipal User user
    ) {

        final Page<OrderResponseDTO> orders = orderService.readAll(method, coin, type, user, PageRequest.of(page, limit));
        return new ResponseEntity<>(orders, HttpStatus.OK);

    }

    @PostMapping
    public ResponseEntity<?> createOrder(
            @Validated(OrderRequestDTO.New.class) @RequestBody OrderRequestDTO orderDTO,
            @AuthenticationPrincipal User user
    ) {
        try {
            orderService.create(orderDTO, user);
        } catch (InsufficientBalanceException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/accept/{id}")
    public ResponseEntity<?> acceptOrder(
            @PathVariable Long id,
            @RequestBody(required = false) PaymentMethodIdDTO paymentMethodIdDTO,
            @AuthenticationPrincipal User user
    ) throws Exception {
        OrderDetailsDTO response;
        try {
            response = orderService.createResponse(
                    id,
                    paymentMethodIdDTO.getPaymentMethodId(),
                    user
            );
        } catch (InsufficientBalanceException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }




    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        final Order order = orderService.read(id);
        return order != null
                ? new ResponseEntity<>(order, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
