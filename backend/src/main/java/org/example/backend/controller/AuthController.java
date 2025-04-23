package org.example.backend.controller;

import org.example.backend.model.user.User;
import org.example.backend.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public User register(@RequestParam String email, @RequestParam String password) {
        return userService.registerUser(email, password);
    }
}