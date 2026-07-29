package com.quizgen.quizgenai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResultResponse {

    private int score;
    private int totalQuestions;

}