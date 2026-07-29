package com.quizgen.quizgenai.service;

import com.quizgen.quizgenai.dto.QuestionDto;
import com.quizgen.quizgenai.dto.QuizRequest;

import java.util.List;

public interface QuizService {

    List<QuestionDto> generateQuiz(QuizRequest request);

}