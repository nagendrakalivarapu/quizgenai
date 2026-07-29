import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Toast from "../components/Toast";

function Register() {

    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {

            await api.post("/auth/register", user);

            setToast({ type: "success", message: "Registration successful! Redirecting to login…" });

            setTimeout(() => navigate("/"), 700);

        } catch (error) {

            setToast({
                type: "error",
                message:
                    error.response?.data?.message ||
                    error.response?.data ||
                    "Registration failed"
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
                    Create an account, <em>start your first paper</em> today.
                </h1>

                <p className="qg-animate-in" style={{ animationDelay: "0.1s" }}>
                    A few details and you're in — pick a topic, choose your difficulty,
                    and QuizGen AI will set the questions for you.
                </p>

                <div className="qg-auth-tags qg-animate-in" style={{ animationDelay: "0.15s" }}>
                    <span className="qg-auth-tag">free to start</span>
                    <span className="qg-auth-tag">no setup</span>
                </div>

            </div>

            <div className="qg-auth-form-wrap">

                <div className="qg-paper qg-animate-in" style={{ animationDelay: "0.1s" }}>

                    <h2 style={{ fontSize: "24px", marginBottom: "4px" }}>Create your account</h2>
                    <p style={{ color: "var(--paper-ink-dim)", fontSize: "14.5px", marginBottom: "26px" }}>
                        It only takes a minute.
                    </p>

                    <form onSubmit={handleSubmit}>

                        <div className="qg-field">
                            <label className="qg-label">Name</label>
                            <input
                                type="text"
                                className="qg-input"
                                name="name"
                                placeholder="Your full name"
                                value={user.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="qg-field">
                            <label className="qg-label">Email</label>
                            <input
                                type="email"
                                className="qg-input"
                                name="email"
                                placeholder="you@example.com"
                                value={user.email}
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
                                    placeholder="At least 8 characters"
                                    value={user.password}
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

                        <button type="submit" className="qg-btn qg-btn--primary" disabled={loading}>
                            {loading && <span className="qg-spinner" />}
                            {loading ? "Creating account…" : "Register"}
                        </button>

                    </form>

                    <div className="qg-auth-switch">
                        Already have an account? <Link to="/">Log in</Link>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;
