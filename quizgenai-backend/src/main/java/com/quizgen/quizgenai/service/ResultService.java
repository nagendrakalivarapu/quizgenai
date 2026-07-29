package com.quizgen.quizgenai.service;

import com.quizgen.quizgenai.dto.ResultResponse;
import com.quizgen.quizgenai.dto.SubmitQuizRequest;

import java.util.List;

public interface ResultService {

    ResultResponse submitQuiz(SubmitQuizRequest request);

    List<ResultResponse> getResults();

}