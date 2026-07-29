package com.quizgen.quizgenai.dto;

import lombok.Data;
import java.util.List;

@Data
public class QuestionDto {

    private String question;
    private List<String> options;
    private String answer;
}