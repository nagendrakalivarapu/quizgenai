//package com.quizgen.quizgenai.service.impl;
//
//import com.quizgen.quizgenai.dto.EmailRequest;
//import com.quizgen.quizgenai.dto.EmailResponse;
//import com.quizgen.quizgenai.service.EmailService;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.scheduling.annotation.Async;
//import org.springframework.stereotype.Service;
//import org.springframework.web.client.RestClient;
//
//import java.util.List;
//
//@Service
//public class EmailServiceImpl implements EmailService {
//
//    private static final Logger log =
//            LoggerFactory.getLogger(EmailServiceImpl.class);
//
//    private final RestClient client;
//
//    @Value("${resend.api.key}")
//    private String apiKey;
//
//    @Value("${resend.from}")
//    private String from;
//
//    public EmailServiceImpl(RestClient client) {
//        this.client = client;
//    }
//
//    @Async
//    @Override
//    public void sendQuizResult(
//            String to,
//            String name,
//            String topic,
//            String difficulty,
//            int score,
//            int totalQuestions) {
//
//        double percentage = (double) score / totalQuestions * 100;
//
//        String html = """
//                <div style="font-family:Arial,sans-serif">
//
//                <h2>🎉 Quiz Result</h2>
//
//                <p>Hello <b>%s</b>,</p>
//
//                <p>Your quiz has been evaluated successfully.</p>
//
//                <table border="1" cellpadding="10" cellspacing="0">
//                    <tr>
//                        <td><b>Topic</b></td>
//                        <td>%s</td>
//                    </tr>
//
//                    <tr>
//                        <td><b>Difficulty</b></td>
//                        <td>%s</td>
//                    </tr>
//
//                    <tr>
//                        <td><b>Score</b></td>
//                        <td>%d / %d</td>
//                    </tr>
//
//                    <tr>
//                        <td><b>Percentage</b></td>
//                        <td>%.2f%%</td>
//                    </tr>
//
//                </table>
//
//                <br>
//
//                <p>Keep learning with QuizGen AI 🚀</p>
//
//                </div>
//                """
//                .formatted(
//                        name,
//                        topic,
//                        difficulty,
//                        score,
//                        totalQuestions,
//                        percentage
//                );
//
//        EmailRequest request = new EmailRequest(
//                from,
//                List.of(to),
//                "Quiz Result",
//                html
//        );
//
//        try {
//
//            EmailResponse response = client.post()
//                    .uri("https://api.resend.com/emails")
//                    .header("Authorization", "Bearer " + apiKey)
//                    .header("Content-Type", "application/json")
//                    .body(request)
//                    .retrieve()
//                    .body(EmailResponse.class);
//
//            log.info("Email sent: {}", response.getId());
//
//        } catch (Exception e) {
//
//            log.error("Email failed", e);
//
//        }
//
//    }
//
//}
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
                <div style="font-family:'Segoe UI',Arial,sans-serif;background-color:#f4f6f8;padding:32px 16px;">
                  <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.06);">

                    <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:28px 24px;text-align:center;">
                      <div style="font-size:40px;line-height:1;margin-bottom:8px;">🎉</div>
                      <h1 style="margin:0;color:#ffffff;font-size:22px;">Your Quiz Result is In!</h1>
                    </div>

                    <div style="padding:28px 24px;">
                      <p style="font-size:16px;color:#1f2937;margin-top:0;">Hi <b>%s</b>,</p>
                      <p style="font-size:15px;color:#4b5563;line-height:1.5;">
                        Great job finishing your quiz! Here's a quick summary of how you did:
                      </p>

                      <table cellpadding="0" cellspacing="0" style="width:100%%;border-collapse:collapse;margin:20px 0;">
                        <tr>
                          <td style="padding:12px 16px;background:#f9fafb;border-radius:8px 8px 0 0;border-bottom:1px solid #eef0f2;color:#6b7280;font-size:14px;">Topic</td>
                          <td style="padding:12px 16px;background:#f9fafb;border-bottom:1px solid #eef0f2;text-align:right;color:#111827;font-size:14px;font-weight:600;">%s</td>
                        </tr>
                        <tr>
                          <td style="padding:12px 16px;background:#f9fafb;border-bottom:1px solid #eef0f2;color:#6b7280;font-size:14px;">Difficulty</td>
                          <td style="padding:12px 16px;background:#f9fafb;border-bottom:1px solid #eef0f2;text-align:right;color:#111827;font-size:14px;font-weight:600;">%s</td>
                        </tr>
                        <tr>
                          <td style="padding:12px 16px;background:#f9fafb;border-bottom:1px solid #eef0f2;color:#6b7280;font-size:14px;">Score</td>
                          <td style="padding:12px 16px;background:#f9fafb;border-bottom:1px solid #eef0f2;text-align:right;color:#111827;font-size:14px;font-weight:600;">%d / %d</td>
                        </tr>
                        <tr>
                          <td style="padding:12px 16px;background:#f9fafb;border-radius:0 0 8px 8px;color:#6b7280;font-size:14px;">Percentage</td>
                          <td style="padding:12px 16px;background:#f9fafb;border-radius:0 0 8px 8px;text-align:right;color:#6366f1;font-size:16px;font-weight:700;">%.2f%%</td>
                        </tr>
                      </table>

                      <p style="font-size:15px;color:#4b5563;line-height:1.5;margin-bottom:0;">
                        Keep up the momentum and challenge yourself with another topic today! 🚀
                      </p>
                    </div>

                    <div style="background:#f9fafb;padding:16px 24px;text-align:center;border-top:1px solid #eef0f2;">
                      <p style="margin:0;font-size:12px;color:#9ca3af;">Sent with ❤️ by QuizGen AI</p>
                    </div>

                  </div>
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
