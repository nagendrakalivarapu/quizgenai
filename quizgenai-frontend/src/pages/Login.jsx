import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Toast from "../components/Toast";

function Login() {

    const navigate = useNavigate();

    const [login, setLogin] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const handleChange = (e) => {
        setLogin({
            ...login,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {

            const response = await api.post("/auth/login", login);

            localStorage.setItem("token", response.data.token);

            setToast({ type: "success", message: "Login successful. Redirecting…" });

            navigate("/dashboard");

        } catch (error) {

            setToast({
                type: "error",
                message:
                    error.response?.data?.message ||
                    error.response?.data ||
                    "Invalid email or password"
            });

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="qg-auth">

            <Toast toast={toast} onClose={() => setToast(null)} />

            <div className="qg-auth-side">

                <span className="qg-blob qg-blob--a" />
                <span className="qg-blob qg-blob--b" />

                <div className="qg-auth-brand qg-animate-in">
                    <span className="qg-auth-seal">Q</span>
                    <span>QuizGen AI</span>
                </div>

                <h1 className="qg-animate-in" style={{ animationDelay: "0.05s" }}>
                    Your next <em>exam paper</em>, written by AI in seconds.
                </h1>

                <p className="qg-animate-in" style={{ animationDelay: "0.1s" }}>
                    Pick a topic, set the difficulty, and QuizGen AI drafts a graded
                    quiz for you to sit — then keeps the marksheet in your history.
                </p>

                <div className="qg-auth-tags qg-animate-in" style={{ animationDelay: "0.15s" }}>
                    <span className="qg-auth-tag">any topic</span>
                    <span className="qg-auth-tag">instant grading</span>
                    <span className="qg-auth-tag">score history</span>
                </div>

            </div>

            <div className="qg-auth-form-wrap">

                <div className="qg-paper qg-animate-in" style={{ animationDelay: "0.1s" }}>

                    <h2 style={{ fontSize: "24px", marginBottom: "4px" }}>Welcome back</h2>
                    <p style={{ color: "var(--paper-ink-dim)", fontSize: "14.5px", marginBottom: "26px" }}>
                        Log in to continue where you left off.
                    </p>

                    <form onSubmit={handleSubmit}>

                        <div className="qg-field">
                            <label className="qg-label">Email</label>
                            <input
                                type="email"
                                className="qg-input"
                                name="email"
                                placeholder="you@example.com"
                                value={login.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="qg-field">
                            <label className="qg-label">Password</label>
                            <div className="qg-input-wrap">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="qg-input"
                                    name="password"
                                    placeholder="••••••••"
                                    value={login.password}
                                    onChange={handleChange}
                                    required
                                    style={{ paddingRight: "62px" }}
                                />
                                <button
                                    type="button"
                                    className="qg-input-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="qg-btn qg-btn--accent" disabled={loading}>
                            {loading && <span className="qg-spinner" />}
                            {loading ? "Logging in…" : "Log in"}
                        </button>

                    </form>

                    <div className="qg-auth-switch">
                        Don't have an account? <Link to="/register">Register</Link>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;
