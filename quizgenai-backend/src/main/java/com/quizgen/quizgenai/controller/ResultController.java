package com.quizgen.quizgenai.controller;

import com.quizgen.quizgenai.dto.ResultResponse;
import com.quizgen.quizgenai.dto.SubmitQuizRequest;
import com.quizgen.quizgenai.service.ResultService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/result")
public class ResultController {

    private final ResultService resultService;

    public ResultController(ResultService resultService) {
        this.resultService = resultService;
    }

    @PostMapping("/submit")
    public ResultResponse submitQuiz(
            @RequestBody SubmitQuizRequest request) {

        return resultService.submitQuiz(request);
    }

    @GetMapping
    public List<ResultResponse> getResults() {
        return resultService.getResults();
    }
}