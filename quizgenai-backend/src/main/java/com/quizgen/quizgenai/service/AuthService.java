package com.quizgen.quizgenai.service;

import com.quizgen.quizgenai.dto.LoginRequest;
import com.quizgen.quizgenai.dto.RegisterRequest;

public interface AuthService {

    String register(RegisterRequest request);

    String login(LoginRequest request);
}