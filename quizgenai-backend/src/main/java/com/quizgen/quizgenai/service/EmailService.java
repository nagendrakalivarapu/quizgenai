package com.quizgen.quizgenai.service;

public interface EmailService {

    void sendQuizResult(
            String to,
            String name,
            String topic,
            String difficulty,
            int score,
            int totalQuestions
    );
}