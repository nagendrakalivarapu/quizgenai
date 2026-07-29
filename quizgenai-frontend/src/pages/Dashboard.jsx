import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";

const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const QUICK_TOPICS = ["Java", "Python", "DBMS", "Operating Systems", "React", "Networking"];

function useCountUp(target, durationMs = 800) {

    const [value, setValue] = useState(0);

    useEffect(() => {

        if (!target || Number.isNaN(target)) {
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

function Dashboard() {

    const navigate = useNavigate();

    const [quiz, setQuiz] = useState({
        topic: "",
        difficulty: "Easy",
        numberOfQuestions: 5
    });

    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);

    const hasUnfinishedQuiz = Boolean(localStorage.getItem("quiz")) && !localStorage.getItem("result");
    const unfinishedDetails = hasUnfinishedQuiz
        ? JSON.parse(localStorage.getItem("quizDetails") || "null")
        : null;

    useEffect(() => {

        const loadStats = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await api.get("/result", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const results = response.data || [];

                if (results.length === 0) {
                    setStats({ attempts: 0, average: 0, best: 0 });
                } else {
                    const percentages = results
                        .filter((r) => r.totalQuestions)
                        .map((r) => (r.score / r.totalQuestions) * 100);

                    const average = percentages.length
                        ? Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length)
                        : Math.round(results.reduce((a, b) => a + b.score, 0) / results.length);

                    const best = percentages.length
                        ? Math.round(Math.max(...percentages))
                        : Math.max(...results.map((r) => r.score));

                    setStats({ attempts: results.length, average, best });
                }

            } catch {
                // Stats are a nice-to-have; fail silently and just hide the strip.
                setStats(null);
            } finally {
                setStatsLoading(false);
            }

        };

        loadStats();

    }, []);

    const handleChange = (e) => {
        setQuiz({
            ...quiz,
            [e.target.name]: e.target.value
        });
    };

    const setDifficulty = (difficulty) => {
        setQuiz({ ...quiz, difficulty });
    };

    const setCount = (numberOfQuestions) => {
        setQuiz({ ...quiz, numberOfQuestions });
    };

    const generateQuiz = async () => {

        if (!quiz.topic.trim()) {
            setToast({ type: "error", message: "Enter a topic before generating a quiz." });
            return;
        }

        if (!quiz.numberOfQuestions || Number(quiz.numberOfQuestions) < 1) {
            setToast({ type: "error", message: "Enter how many questions you'd like (1 or more)." });
            return;
        }

        setLoading(true);

        try {

            const token = localStorage.getItem("token");

            const response = await api.post(
                "/quiz/generate",
                quiz,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            localStorage.setItem(
                "quiz",
                JSON.stringify(response.data)
            );

            localStorage.setItem(
                "quizDetails",
                JSON.stringify(quiz)
            );

            localStorage.removeItem("result");

            navigate("/quiz");

        } catch (error) {

            console.error(error);

            setToast({
                type: "error",
                message: error.response?.data || error.message
            });

        } finally {
            setLoading(false);
        }

    };

    const attemptsCount = useCountUp(stats?.attempts ?? 0);
    const averageCount = useCountUp(stats?.average ?? 0);
    const bestCount = useCountUp(stats?.best ?? 0);

    return (

        <div className="qg-shell">

            <Navbar />

            <Toast toast={toast} onClose={() => setToast(null)} />

            <div className="qg-page" style={{ position: "relative", overflow: "hidden" }}>

                <span className="qg-blob qg-blob--a" style={{ position: "fixed" }} />
                <span className="qg-blob qg-blob--b" style={{ position: "fixed" }} />

                <div className="qg-container" style={{ position: "relative", zIndex: 1 }}>

                    <div className="qg-eyebrow qg-animate-in">New paper</div>
                    <h1 className="qg-title qg-animate-in" style={{ animationDelay: "0.05s" }}>Set today's exam</h1>
                    <p className="qg-subtitle qg-animate-in" style={{ animationDelay: "0.1s" }}>
                        Choose a topic and difficulty — QuizGen AI writes the questions.
                    </p>

                    {!statsLoading && stats && stats.attempts > 0 && (
                        <div className="qg-stats-strip qg-animate-in" style={{ animationDelay: "0.12s" }}>
                            <div className="qg-stat-card">
                                <div className="qg-stat-value">{attemptsCount}</div>
                                <div className="qg-stat-label">Quizzes taken</div>
                            </div>
                            <div className="qg-stat-card">
                                <div className="qg-stat-value">{averageCount}%</div>
                                <div className="qg-stat-label">Average score</div>
                            </div>
                            <div className="qg-stat-card">
                                <div className="qg-stat-value">{bestCount}%</div>
                                <div className="qg-stat-label">Best score</div>
                            </div>
                        </div>
                    )}

                    {hasUnfinishedQuiz && (
                        <div className="qg-continue-banner qg-animate-in" style={{ animationDelay: "0.15s" }}>
                            <p>
                                You have a quiz in progress
                                {unfinishedDetails?.topic ? <> — <strong>{unfinishedDetails.topic}</strong></> : null}.
                            </p>
                            <button onClick={() => navigate("/quiz")}>Resume</button>
                        </div>
                    )}

                    <div className="qg-paper qg-paper--torn qg-animate-in" style={{ animationDelay: "0.18s" }}>

                        <div className="qg-paper-clip" />

                        <div className="qg-dash-grid">

                            <div className="qg-field" style={{ marginBottom: "12px" }}>
                                <label className="qg-label">Topic</label>
                                <input
                                    type="text"
                                    className="qg-input"
                                    name="topic"
                                    placeholder="Java, Python, DBMS…"
                                    value={quiz.topic}
                                    onChange={handleChange}
                                />

                                <div className="qg-quick-topics">
                                    {QUICK_TOPICS.map((topic) => (
                                        <button
                                            key={topic}
                                            type="button"
                                            className="qg-quick-topic"
                                            onClick={() => setQuiz({ ...quiz, topic })}
                                        >
                                            {topic}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="qg-field" style={{ marginBottom: "6px" }}>
                                <label className="qg-label">Difficulty</label>
                                <div className="qg-segmented">
                                    {DIFFICULTIES.map((level) => (
                                        <button
                                            key={level}
                                            type="button"
                                            data-level={level}
                                            className={quiz.difficulty === level ? "is-selected" : ""}
                                            onClick={() => setDifficulty(level)}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="qg-field" style={{ marginBottom: "0" }}>
                                <label className="qg-label">Number of questions</label>
                                <input
                                    type="number"
                                    className="qg-input"
                                    name="numberOfQuestions"
                                    min="1"
                                    step="1"
                                    placeholder="e.g. 10"
                                    value={quiz.numberOfQuestions}
                                    onChange={(e) => {
                                        const raw = e.target.value;
                                        if (raw === "") {
                                            setQuiz({ ...quiz, numberOfQuestions: "" });
                                            return;
                                        }
                                        const parsed = Math.max(1, Math.floor(Number(raw)));
                                        setQuiz({ ...quiz, numberOfQuestions: Number.isNaN(parsed) ? "" : parsed });
                                    }}
                                />
                                <div className="qg-quick-topics">
                                    {["5", "10", "15", "20", "25"].map((count) => (
                                        <button
                                            key={count}
                                            type="button"
                                            className="qg-quick-topic"
                                            onClick={() => setCount(Number(count))}
                                        >
                                            {count}
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </div>

                        <div className="qg-dash-actions">

                            <button
                                className="qg-btn qg-btn--accent"
                                onClick={generateQuiz}
                                disabled={loading}
                            >
                                {loading && <span className="qg-spinner" />}
                                {loading ? "Drafting your paper…" : "Generate quiz"}
                            </button>

                            <div className="qg-divider-label">or</div>

                            <button
                                className="qg-btn qg-btn--ghost"
                                onClick={() => navigate("/history")}
                            >
                                View quiz history
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Dashboard;
