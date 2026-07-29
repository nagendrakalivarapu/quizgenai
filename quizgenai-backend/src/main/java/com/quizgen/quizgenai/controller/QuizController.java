package com.quizgen.quizgenai.controller;

import com.quizgen.quizgenai.dto.QuestionDto;
import com.quizgen.quizgenai.dto.QuizRequest;
import com.quizgen.quizgenai.service.QuizService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @PostMapping("/generate")
    public List<QuestionDto> generateQuiz(@RequestBody QuizRequest request) {
        return quizService.generateQuiz(request);
    }
}