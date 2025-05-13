package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.DTO.*;
import org.example.backend.model.order.OrderType;
import org.example.backend.model.user.User;
import org.example.backend.service.BalanceService;
import org.example.backend.service.ResponseService;
import org.example.backend.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final ResponseService responseService;
    private final UserService userService;
    private final BalanceService balanceService;

    @GetMapping("/{userId}/responses")
    public ResponseEntity<Page<OrderWithStatusDTO>> getUserOrders(
            @PathVariable Long userId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String currency,
            @RequestParam(required = false) OrderType type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int limit
    ) {

        Page<OrderWithStatusDTO> orders = responseService.getUserResponses(userId, status, currency, type, PageRequest.of(page, limit));
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserInfo(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "min") String info,
            @AuthenticationPrincipal User user
    ) {
        if (Objects.equals(info, "min")) {
            UserOrderDTO userInfo = userService.getMinInfo(userId);
            return new ResponseEntity<>(userInfo, HttpStatus.OK);
        }

        else {
            FullUserInfoDTO userInfo = userService.getMaxInfo(user, userId);
            return new ResponseEntity<>(userInfo, HttpStatus.OK);
        }
    }

    @GetMapping("/balances")
    public ResponseEntity<?> getUserBalances(
            @AuthenticationPrincipal User user
    ) {
        List<BalanceDTO> balances = balanceService.getUserBalances(user);
        return new ResponseEntity<>(balances, HttpStatus.OK);
    }

    @PostMapping("/balances")
    public ResponseEntity<?> createDeposit(
            @AuthenticationPrincipal User user,
            @RequestBody BalanceRequestDTO dto
    ) {
        balanceService.createDeposit(user, dto);

        return new ResponseEntity<>(HttpStatus.CREATED);
    }
}
