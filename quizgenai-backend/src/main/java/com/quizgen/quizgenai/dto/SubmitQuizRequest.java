package com.quizgen.quizgenai.dto;

import lombok.Data;

import java.util.List;

@Data
public class SubmitQuizRequest {

    private String topic;
    private String difficulty;
    private List<QuestionDto> questions;
    private List<String> userAnswers;

}