package com.quizgen.quizgenai.controller;

import com.quizgen.quizgenai.dto.AuthResponse;
import com.quizgen.quizgenai.dto.LoginRequest;
import com.quizgen.quizgenai.dto.RegisterRequest;
import com.quizgen.quizgenai.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public String register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {

        String token = authService.login(request);

        return new AuthResponse(token);

    }
}