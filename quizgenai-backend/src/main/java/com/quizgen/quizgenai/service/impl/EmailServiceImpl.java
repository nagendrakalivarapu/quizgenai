//package com.quizgen.quizgenai.service.impl;
//
//import com.quizgen.quizgenai.service.EmailService;
//import org.springframework.mail.SimpleMailMessage;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.stereotype.Service;
//
//@Service
//public class EmailServiceImpl implements EmailService {
//
//    private final JavaMailSender mailSender;
//
//    public EmailServiceImpl(JavaMailSender mailSender) {
//        this.mailSender = mailSender;
//    }
//
//    @Override
//    public void sendQuizResult(String to,
//                               String name,
//                               String topic,
//                               String difficulty,
//                               int score,
//                               int totalQuestions) {
//
//        double percentage = (double) score / totalQuestions * 100;
//
//        String body = """
//                Hello %s,
//
//                Congratulations on completing your AI Quiz!
//
//                ----------------------------------------
//                Quiz Details
//                ----------------------------------------
//
//                Name       : %s
//                Topic      : %s
//                Difficulty : %s
//
//                Score      : %d / %d
//                Percentage : %.2f%%
//
//                Keep learning and keep improving!
//
//                Regards,
//                QuizGen AI Team
//                """
//                .formatted(
//                        name,
//                        name,
//                        topic,
//                        difficulty,
//                        score,
//                        totalQuestions,
//                        percentage
//                );
//
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setTo(to);
//        message.setSubject("QuizGen AI - Your Quiz Result");
//        message.setText(body);
//
//        mailSender.send(message);
//    }
//}
//------------------------------------------------------------------------------------
package com.quizgen.quizgenai.service.impl;

import com.quizgen.quizgenai.service.EmailService;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendQuizResult(String to,
                               String name,
                               String topic,
                               String difficulty,
                               int score,
                               int totalQuestions) {

        double percentage = (double) score / totalQuestions * 100;
        String feedback = getFeedback(percentage);

        String body = """
                Hi %s,

                Here's how you did on your recent AI Quiz!

                ------------------------------------------
                Quiz Summary
                ------------------------------------------
                Topic       : %s
                Difficulty  : %s
                Score       : %d / %d
                Percentage  : %.2f%%
                ------------------------------------------

                %s

                Thanks for using QuizGen AI — keep learning!

                Best regards,
                The QuizGen AI Team
                """
                .formatted(
                        name,
                        topic,
                        difficulty,
                        score,
                        totalQuestions,
                        percentage,
                        feedback
                );

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Your Quiz Result – " + topic + " (" + String.format("%.0f", percentage) + "%)");
        message.setText(body);

        mailSender.send(message);
    }

    private String getFeedback(double percentage) {
        if (percentage >= 90) return "Outstanding work! You've truly mastered this topic.";
        if (percentage >= 75) return "Great job! You have a strong grasp of the material.";
        if (percentage >= 50) return "Good effort! A bit more practice and you'll ace it next time.";
        return "Don't worry — every attempt is a step forward. Keep practicing!";
    }
}