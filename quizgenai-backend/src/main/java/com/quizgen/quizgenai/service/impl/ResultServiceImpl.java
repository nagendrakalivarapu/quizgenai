package com.quizgen.quizgenai.service.impl;

import com.quizgen.quizgenai.dto.QuestionDto;
import com.quizgen.quizgenai.dto.ResultResponse;
import com.quizgen.quizgenai.dto.SubmitQuizRequest;
import com.quizgen.quizgenai.entity.Result;
import com.quizgen.quizgenai.entity.User;
import com.quizgen.quizgenai.repository.ResultRepository;
import com.quizgen.quizgenai.repository.UserRepository;
import com.quizgen.quizgenai.service.EmailService;
import com.quizgen.quizgenai.service.ResultService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ResultServiceImpl implements ResultService {

    private final ResultRepository resultRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public ResultServiceImpl(ResultRepository resultRepository,
                             UserRepository userRepository,
                             EmailService emailService) {
        this.resultRepository = resultRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    @Override
    public ResultResponse submitQuiz(SubmitQuizRequest request) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow();

        int score = 0;

        List<QuestionDto> questions = request.getQuestions();

        for (int i = 0; i < questions.size(); i++) {

            if (questions.get(i).getAnswer()
                    .equalsIgnoreCase(request.getUserAnswers().get(i))) {

                score++;
            }
        }

        Result result = Result.builder()
                .topic(request.getTopic())
                .difficulty(request.getDifficulty())
                .totalQuestions(questions.size())
                .score(score)
                .testDate(LocalDateTime.now())
                .user(user)
                .build();

        // Save result in database
        resultRepository.save(result);

        // Send result to registered email
        emailService.sendQuizResult(
                user.getEmail(),
                user.getName(),
                request.getTopic(),
                request.getDifficulty(),
                score,
                questions.size()
        );

        return new ResultResponse(score, questions.size());
    }

    @Override
    public List<ResultResponse> getResults() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow();

        return resultRepository.findByUser(user)
                .stream()
                .map(r -> new ResultResponse(
                        r.getScore(),
                        r.getTotalQuestions()
                ))
                .toList();
    }
}