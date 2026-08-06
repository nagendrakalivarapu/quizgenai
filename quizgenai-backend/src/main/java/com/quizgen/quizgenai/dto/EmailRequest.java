package com.quizgen.quizgenai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class EmailRequest {

    private String from;
    private List<String> to;
    private String subject;
    private String html;

}