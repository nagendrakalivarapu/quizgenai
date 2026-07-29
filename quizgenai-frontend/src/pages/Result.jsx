import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";

function useCountUp(target, durationMs = 900) {

    const [value, setValue] = useState(0);

    useEffect(() => {

        if (target === null || target === undefined || Number.isNaN(target)) {
            setValue(0);
            return undefined;
        }

        let raf;
        const start = performance.now();

        const tick = (now) => {
            const progress = Math.min(1, (now - start) / durationMs);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(target * eased));
            if (progress < 1) raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);

    }, [target, durationMs]);

    return value;
}

function gradeFromPercent(percent) {
    if (percent >= 90) return "A+";
    if (percent >= 80) return "A";
    if (percent >= 65) return "B";
    if (percent >= 50) return "C";
    if (percent >= 35) return "D";
    return "F";
}

const CONFETTI_COLORS = ["#b23b30", "#b98a2e", "#d4a13f", "#f7f2e6", "#2c4d7d"];

function Confetti() {

    const pieces = Array.from({ length: 26 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        delay: Math.random() * 0.4,
        duration: 1.4 + Math.random() * 0.8
    }));

    return (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
            {pieces.map((p) => (
                <span
                    key={p.id}
                    className="qg-confetti-piece"
                    style={{
                        left: `${p.left}%`,
                        background: p.color,
                        animationDelay: `${p.delay}s`,
                        animationDuration: `${p.duration}s`
                    }}
                />
            ))}
        </div>
    );
}

function Result() {

    const navigate = useNavigate();

    const [result, setResult] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => {

        const storedResult = localStorage.getItem("result");

        if (!storedResult) {
            navigate("/dashboard");
            return;
        }

        setResult(JSON.parse(storedResult));

    }, [navigate]);

    const total = result?.totalQuestions;
    const percent = result && total ? Math.round((result.score / total) * 100) : null;
    const animatedScore = useCountUp(result?.score ?? null);

    if (!result) {
        return (
            <div className="qg-shell">
                <Navbar />
                <div className="qg-loading">
                    <span className="qg-spinner" />
                    <span>Grading in progress…</span>
                </div>
            </div>
        );
    }

    let verdict = "Nicely done — that's in the books.";
    if (percent !== null) {
        if (percent >= 80) verdict = "Excellent work — top marks on this one.";
        else if (percent >= 50) verdict = "Solid attempt — a bit more practice and you'll ace it.";
        else verdict = "Worth another go — review the topic and retake it.";
    }

    const shareResult = async () => {

        const text = percent !== null
            ? `I scored ${result.score}/${total} (${percent}%) on the ${result.topic} (${result.difficulty}) quiz on QuizGen AI!`
            : `I scored ${result.score} on the ${result.topic} (${result.difficulty}) quiz on QuizGen AI!`;

        try {
            await navigator.clipboard.writeText(text);
            setToast({ type: "success", message: "Result copied to clipboard." });
        } catch {
            setToast({ type: "error", message: "Couldn't copy — your browser may not allow clipboard access." });
        }

    };

    return (

        <div className="qg-shell">

            <Navbar />

            <Toast toast={toast} onClose={() => setToast(null)} />

            <div className="qg-page">

                <div className="qg-container">

                    <div className="qg-eyebrow qg-animate-in">Marksheet</div>
                    <h1 className="qg-title qg-animate-in" style={{ animationDelay: "0.05s" }}>Quiz graded</h1>
                    <p className="qg-subtitle qg-animate-in" style={{ animationDelay: "0.1s" }}>Here's how you did.</p>

                    <div className="qg-paper qg-result-paper" style={{ overflow: "hidden" }}>

                        {percent !== null && percent >= 80 && <Confetti />}

                        <div className="qg-stamp">
                            <span className="qg-stamp-label">Score</span>
                            <span className="qg-stamp-score">{animatedScore}</span>
                            {total ? <span className="qg-stamp-total">/ {total}</span> : null}
                        </div>

                        <div className="qg-result-meta">
                            <span className="qg-pill">Topic · {result.topic}</span>
                            <span className="qg-pill">Difficulty · {result.difficulty}</span>
                            {percent !== null && <span className="qg-pill">{percent}%</span>}
                            {percent !== null && (
                                <span className="qg-grade-badge">{gradeFromPercent(percent)}</span>
                            )}
                        </div>

                        <p className="qg-result-verdict">{verdict}</p>

                        <div className="qg-btn-row">

                            <button
                                className="qg-btn qg-btn--primary"
                                onClick={() => navigate("/dashboard")}
                            >
                                Take another quiz
                            </button>

                            <button
                                className="qg-btn qg-btn--ghost"
                                onClick={() => navigate("/history")}
                            >
                                View history
                            </button>

                        </div>

                        <div className="qg-share-row">
                            <button className="qg-share-btn" onClick={shareResult}>
                                Copy result to share
                            </button>
                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Result;
