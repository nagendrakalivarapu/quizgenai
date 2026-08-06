package com.quizgen.quizgenai.service.impl;

import com.quizgen.quizgenai.dto.EmailRequest;
import com.quizgen.quizgenai.dto.EmailResponse;
import com.quizgen.quizgenai.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger log =
            LoggerFactory.getLogger(EmailServiceImpl.class);

    private final RestClient client;

    @Value("${resend.api.key}")
    private String apiKey;

    @Value("${resend.from}")
    private String from;

    public EmailServiceImpl(RestClient client) {
        this.client = client;
    }

    @Async
    @Override
    public void sendQuizResult(
            String to,
            String name,
            String topic,
            String difficulty,
            int score,
            int totalQuestions) {

        double percentage = (double) score / totalQuestions * 100;

        String html = """
                <div style="font-family:Arial,sans-serif">

                <h2>🎉 Quiz Result</h2>

                <p>Hello <b>%s</b>,</p>

                <p>Your quiz has been evaluated successfully.</p>

                <table border="1" cellpadding="10" cellspacing="0">
                    <tr>
                        <td><b>Topic</b></td>
                        <td>%s</td>
                    </tr>

                    <tr>
                        <td><b>Difficulty</b></td>
                        <td>%s</td>
                    </tr>

                    <tr>
                        <td><b>Score</b></td>
                        <td>%d / %d</td>
                    </tr>

                    <tr>
                        <td><b>Percentage</b></td>
                        <td>%.2f%%</td>
                    </tr>

                </table>

                <br>

                <p>Keep learning with QuizGen AI 🚀</p>

                </div>
                """
                .formatted(
                        name,
                        topic,
                        difficulty,
                        score,
                        totalQuestions,
                        percentage
                );

        EmailRequest request = new EmailRequest(
                from,
                List.of(to),
                "Quiz Result",
                html
        );

        try {

            EmailResponse response = client.post()
                    .uri("https://api.resend.com/emails")
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .body(request)
                    .retrieve()
                    .body(EmailResponse.class);

            log.info("Email sent: {}", response.getId());

        } catch (Exception e) {

            log.error("Email failed", e);

        }

    }

}