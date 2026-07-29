import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";

function percentOf(result) {
    if (!result.totalQuestions) return null;
    return Math.round((result.score / result.totalQuestions) * 100);
}

function scoreBadgeClass(score, total) {
    if (!total) return "qg-score-badge--mid";
    const pct = (score / total) * 100;
    if (pct >= 80) return "qg-score-badge--high";
    if (pct >= 50) return "qg-score-badge--mid";
    return "qg-score-badge--low";
}

function History() {

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [sortMode, setSortMode] = useState("recent"); // "recent" | "best" | "worst"

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await api.get(
                "/result",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setResults(response.data);

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

    const stats = useMemo(() => {

        if (results.length === 0) return null;

        const percentages = results.map(percentOf).filter((p) => p !== null);

        const average = percentages.length
            ? Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length)
            : Math.round(results.reduce((a, b) => a + b.score, 0) / results.length);

        const best = percentages.length
            ? Math.max(...percentages)
            : Math.max(...results.map((r) => r.score));

        return { attempts: results.length, average, best };

    }, [results]);

    const sortedResults = useMemo(() => {

        const withIndex = results.map((r, i) => ({ ...r, originalIndex: i }));

        if (sortMode === "best") {
            return [...withIndex].sort((a, b) => (percentOf(b) ?? b.score) - (percentOf(a) ?? a.score));
        }
        if (sortMode === "worst") {
            return [...withIndex].sort((a, b) => (percentOf(a) ?? a.score) - (percentOf(b) ?? b.score));
        }
        return withIndex;

    }, [results, sortMode]);

    const sparkData = results.slice(-12);
    const sparkMax = sparkData.length
        ? Math.max(...sparkData.map((r) => percentOf(r) ?? r.score), 1)
        : 1;

    return (

        <div className="qg-shell">

            <Navbar />

            <Toast toast={toast} onClose={() => setToast(null)} />

            <div className="qg-page">

                <div className="qg-container qg-container--wide">

                    <div className="qg-eyebrow qg-animate-in">Gradebook</div>
                    <h1 className="qg-title qg-animate-in" style={{ animationDelay: "0.05s" }}>Quiz history</h1>
                    <p className="qg-subtitle qg-animate-in" style={{ animationDelay: "0.1s" }}>
                        Every paper you've sat, graded and filed.
                    </p>

                    {stats && (
                        <div className="qg-stats-strip qg-animate-in" style={{ animationDelay: "0.12s" }}>
                            <div className="qg-stat-card">
                                <div className="qg-stat-value">{stats.attempts}</div>
                                <div className="qg-stat-label">Attempts</div>
                            </div>
                            <div className="qg-stat-card">
                                <div className="qg-stat-value">{stats.average}%</div>
                                <div className="qg-stat-label">Average</div>
                            </div>
                            <div className="qg-stat-card">
                                <div className="qg-stat-value">{stats.best}%</div>
                                <div className="qg-stat-label">Best</div>
                            </div>
                        </div>
                    )}

                    <div className="qg-paper qg-animate-in" style={{ animationDelay: "0.16s" }}>

                        {loading ? (

                            <div className="qg-loading" style={{ padding: "40px 0" }}>
                                <span className="qg-spinner" style={{ borderColor: "var(--paper-line)", borderTopColor: "var(--red-pen)" }} />
                                <span style={{ color: "var(--paper-ink-dim)" }}>Fetching your records…</span>
                            </div>

                        ) : results.length === 0 ? (

                            <div className="qg-empty-state">
                                <div className="qg-empty-state-icon">🗂️</div>
                                <h3 style={{ marginBottom: "8px" }}>No quizzes on file yet</h3>
                                <p style={{ color: "var(--paper-ink-dim)" }}>
                                    Generate your first quiz and it'll show up here.
                                </p>
                            </div>

                        ) : (
                            <>
                                {sparkData.length > 1 && (
                                    <div className="qg-sparkline">
                                        {sparkData.map((r, i) => {
                                            const pct = percentOf(r) ?? r.score;
                                            const heightPct = Math.max(8, Math.round((pct / sparkMax) * 100));
                                            const cls = pct >= 80 ? "qg-spark-bar--high" : pct < 50 ? "qg-spark-bar--low" : "";
                                            return (
                                                <div
                                                    key={i}
                                                    className={`qg-spark-bar ${cls}`}
                                                    style={{ height: `${heightPct}%`, animationDelay: `${i * 0.03}s` }}
                                                    title={`${pct}${percentOf(r) !== null ? "%" : ""}`}
                                                />
                                            );
                                        })}
                                    </div>
                                )}

                                <div className="qg-history-toolbar">
                                    <span style={{ fontSize: "13px", color: "var(--paper-ink-dim)" }}>
                                        {results.length} quiz{results.length === 1 ? "" : "zes"} on file
                                    </span>
                                    <div style={{ display: "flex", gap: "8px" }}>
                                        <button
                                            className="qg-sort-btn"
                                            style={sortMode === "recent" ? { borderColor: "var(--red-pen)", color: "var(--red-pen)" } : undefined}
                                            onClick={() => setSortMode("recent")}
                                        >
                                            Recent
                                        </button>
                                        <button
                                            className="qg-sort-btn"
                                            style={sortMode === "best" ? { borderColor: "var(--red-pen)", color: "var(--red-pen)" } : undefined}
                                            onClick={() => setSortMode("best")}
                                        >
                                            Best first
                                        </button>
                                        <button
                                            className="qg-sort-btn"
                                            style={sortMode === "worst" ? { borderColor: "var(--red-pen)", color: "var(--red-pen)" } : undefined}
                                            onClick={() => setSortMode("worst")}
                                        >
                                            Worst first
                                        </button>
                                    </div>
                                </div>

                                <table className="qg-gradebook">

                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Score</th>
                                            <th>Total questions</th>
                                            <th>Result</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {sortedResults.map((result, index) => {
                                            const pct = percentOf(result);
                                            return (
                                                <tr key={index} style={{ animationDelay: `${Math.min(index * 0.04, 0.4)}s` }}>

                                                    <td className="qg-td-num">{result.originalIndex + 1}</td>

                                                    <td>
                                                        <span className={`qg-score-badge ${scoreBadgeClass(result.score, result.totalQuestions)}`}>
                                                            {result.score}
                                                        </span>
                                                    </td>

                                                    <td>{result.totalQuestions}</td>

                                                    <td style={{ color: "var(--paper-ink-dim)", fontFamily: "var(--mono)", fontSize: "13px" }}>
                                                        {pct !== null ? `${pct}%` : "—"}
                                                    </td>

                                                </tr>
                                            );
                                        })}
                                    </tbody>

                                </table>
                            </>
                        )}

                    </div>

                </div>

            </div>

        </div>

    );

}

export default History;
