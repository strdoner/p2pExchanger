package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.DTO.EncryptedPaymentMethodDTO;
import org.example.backend.DTO.PaymentMethodRequestDTO;
import org.example.backend.model.Notification;
import org.example.backend.model.user.PaymentMethod;
import org.example.backend.model.user.User;
import org.example.backend.service.PaymentMethodService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cards")
@RequiredArgsConstructor
public class PaymentMethodsController {
    private final PaymentMethodService paymentMethodService;

    @PostMapping
    public ResponseEntity<EncryptedPaymentMethodDTO> addPaymentMethod(
            @AuthenticationPrincipal User user,
            @RequestBody PaymentMethodRequestDTO paymentMethod
    ) throws Exception {
        EncryptedPaymentMethodDTO createdMethod = paymentMethodService.create(paymentMethod, user);


        return new ResponseEntity<>(createdMethod, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<EncryptedPaymentMethodDTO>> getPaymentMethods(
            @AuthenticationPrincipal User user
    ) throws Exception {
        List<EncryptedPaymentMethodDTO> userMethods = paymentMethodService.getEncryptedPaymentMethods(user);


        return new ResponseEntity<>(userMethods, HttpStatus.OK);
    }


}
