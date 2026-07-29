import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

function formatElapsed(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

function Quiz() {

    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState(null);
    const [elapsed, setElapsed] = useState(0);
    const [quizDetails, setQuizDetails] = useState(null);

    const cardRefs = useRef([]);

    useEffect(() => {

        const storedQuiz = localStorage.getItem("quiz");

        if (!storedQuiz) {
            navigate("/dashboard");
            return;
        }

        const quiz = JSON.parse(storedQuiz);

        setQuestions(quiz);
        setAnswers(new Array(quiz.length).fill(""));

        const storedDetails = localStorage.getItem("quizDetails");
        if (storedDetails) setQuizDetails(JSON.parse(storedDetails));

    }, [navigate]);

    useEffect(() => {

        const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
        return () => clearInterval(timer);

    }, []);

    const handleAnswerChange = (questionIndex, answer) => {

        const updatedAnswers = [...answers];
        updatedAnswers[questionIndex] = answer;

        setAnswers(updatedAnswers);

    };

    const jumpToQuestion = (index) => {
        cardRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    const answeredCount = answers.filter((a) => a !== "").length;
    const progressPct = questions.length ? Math.round((answeredCount / questions.length) * 100) : 0;

    const submitQuiz = async () => {

        if (answers.includes("")) {
            setToast({ type: "error", message: "Please answer all questions before submitting." });
            const firstUnanswered = answers.findIndex((a) => a === "");
            if (firstUnanswered !== -1) jumpToQuestion(firstUnanswered);
            return;
        }

        setSubmitting(true);

        try {

            const token = localStorage.getItem("token");

            const storedDetails = JSON.parse(
                localStorage.getItem("quizDetails")
            );

            const request = {

                topic: storedDetails.topic,
                difficulty: storedDetails.difficulty,
                questions: questions,
                userAnswers: answers

            };

            const response = await api.post(
                "/result/submit",
                request,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            localStorage.setItem(
                "result",
                JSON.stringify(response.data)
            );

            navigate("/result");

        } catch (error) {

            console.error(error);

            setToast({
                type: "error",
                message:
                    error.response?.data?.message ||
                    error.response?.data ||
                    error.message
            });

        } finally {
            setSubmitting(false);
        }

    };

    return (

        <div className="qg-shell">

            <Navbar />

            <Toast toast={toast} onClose={() => setToast(null)} />

            <div className="qg-page">

                <div className="qg-container">

                    <div className="qg-quiz-header">

                        <div className="qg-quiz-topbar">

                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                {quizDetails?.topic && <span className="qg-pill" style={{ background: "var(--ink-raised)", borderColor: "var(--ink-line)", color: "var(--ink-text-dim)" }}>{quizDetails.topic}</span>}
                                {quizDetails?.difficulty && <span className="qg-pill" style={{ background: "var(--ink-raised)", borderColor: "var(--ink-line)", color: "var(--ink-text-dim)" }}>{quizDetails.difficulty}</span>}
                            </div>

                            <div className="qg-quiz-timer">
                                <span className="qg-quiz-timer-dot" />
                                {formatElapsed(elapsed)}
                            </div>

                        </div>

                        <div className="qg-quiz-progress-track">
                            <div className="qg-quiz-progress-fill" style={{ width: `${progressPct}%` }} />
                        </div>

                        <div className="qg-quiz-progress-meta">
                            <span>{answeredCount} of {questions.length} answered</span>
                            <span>{progressPct}%</span>
                        </div>

                        {questions.length > 1 && (
                            <div className="qg-quiz-dots" style={{ marginTop: "12px" }}>
                                {questions.map((_, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        className={`qg-quiz-dot ${answers[i] ? "is-done" : ""}`}
                                        onClick={() => jumpToQuestion(i)}
                                        title={`Go to question ${i + 1}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}

                    </div>

                    {questions.map((question, qIndex) => (

                        <div
                            key={qIndex}
                            ref={(el) => (cardRefs.current[qIndex] = el)}
                            className={`qg-paper qg-question-card qg-animate-in-fast ${answers[qIndex] ? "is-answered" : ""}`}
                            style={{ animationDelay: `${Math.min(qIndex * 0.06, 0.4)}s` }}
                        >

                            <div className="qg-question-head">
                                <span className="qg-question-num">{qIndex + 1}</span>
                                <h4 className="qg-question-text">{question.question}</h4>
                            </div>

                            <div className="qg-options">

                                {question.options.map((option, oIndex) => (

                                    <label
                                        className={`qg-option ${answers[qIndex] === option ? "is-selected" : ""}`}
                                        key={oIndex}
                                        htmlFor={`q${qIndex}-o${oIndex}`}
                                    >

                                        <input
                                            id={`q${qIndex}-o${oIndex}`}
                                            type="radio"
                                            name={`question-${qIndex}`}
                                            value={option}
                                            checked={answers[qIndex] === option}
                                            onChange={() =>
                                                handleAnswerChange(qIndex, option)
                                            }
                                        />

                                        <span className="qg-option-letter">{LETTERS[oIndex] || oIndex + 1}</span>
                                        <span className="qg-option-text">{option}</span>

                                    </label>

                                ))}

                            </div>

                        </div>

                    ))}

                    {questions.length > 0 && (

                        <div className="qg-quiz-submit-bar">
                            <button
                                className="qg-btn qg-btn--accent"
                                onClick={submitQuiz}
                                disabled={submitting}
                            >
                                {submitting && <span className="qg-spinner" />}
                                {submitting ? "Grading your paper…" : `Submit quiz (${answeredCount}/${questions.length})`}
                            </button>
                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}

export default Quiz;
