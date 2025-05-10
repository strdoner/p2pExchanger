package org.example.backend.controller;

import org.example.backend.model.Notification;
import org.example.backend.model.user.PaymentMethod;
import org.example.backend.model.user.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cards")
public class PaymentDetailsController {

    @PostMapping
    public ResponseEntity<List<Notification>> getUserNotifications(
            @AuthenticationPrincipal User user,
            @RequestBody PaymentMethod paymentMethod
    ) {



        return new ResponseEntity<>(notifications, HttpStatus.OK);
    }


}
