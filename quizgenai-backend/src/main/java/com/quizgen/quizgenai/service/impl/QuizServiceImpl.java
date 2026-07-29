package com.quizgen.quizgenai.service.impl;

import com.quizgen.quizgenai.dto.QuestionDto;
import com.quizgen.quizgenai.dto.QuizRequest;
import com.quizgen.quizgenai.service.GeminiService;
import com.quizgen.quizgenai.service.QuizService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizServiceImpl implements QuizService {

    private final GeminiService geminiService;

    public QuizServiceImpl(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @Override
    public List<QuestionDto> generateQuiz(QuizRequest request) {

        return geminiService.generateQuiz(
                request.getTopic(),
                request.getDifficulty(),
                request.getNumberOfQuestions()
        );
    }
}