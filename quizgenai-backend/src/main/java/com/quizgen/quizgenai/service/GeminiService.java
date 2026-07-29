package com.quizgen.quizgenai.service;

import com.quizgen.quizgenai.dto.QuestionDto;

import java.util.List;

public interface GeminiService {

    List<QuestionDto> generateQuiz(String topic,
                                   String difficulty,
                                   int numberOfQuestions);

}