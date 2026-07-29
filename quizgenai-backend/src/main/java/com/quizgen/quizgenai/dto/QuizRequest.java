package com.quizgen.quizgenai.dto;

import lombok.Data;

@Data
public class QuizRequest {

    private String topic;

    private String difficulty;

    private int numberOfQuestions;
}