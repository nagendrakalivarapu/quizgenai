package com.quizgen.quizgenai.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import com.quizgen.quizgenai.dto.QuestionDto;
import com.quizgen.quizgenai.service.GeminiService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class GeminiServiceImpl implements GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.model}")
    private String model;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public List<QuestionDto> generateQuiz(
            String topic,
            String difficulty,
            int numberOfQuestions) {

        Client client = Client.builder()
                .apiKey(apiKey)
                .build();

        String prompt = """
                Generate %d multiple-choice questions on the topic "%s".

                Difficulty: %s.

                Return ONLY valid JSON in this format:

                [
                  {
                    "question":"...",
                    "options":["...","...","...","..."],
                    "answer":"..."
                  }
                ]

                Return only JSON.
                """.formatted(numberOfQuestions, topic, difficulty);

        GenerateContentResponse response =
                client.models.generateContent(
                        model,
                        prompt,
                        null
                );

        try {
            return objectMapper.readValue(
                    response.text(),
                    new TypeReference<List<QuestionDto>>() {}
            );
        } catch (IOException e) {
            throw new RuntimeException("Failed to parse Gemini response", e);
        }
    }
}