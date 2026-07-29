import { Link, useLocation, useNavigate } from "react-router-dom";
import { getDisplayNameFromToken } from "../utils/jwt";

function Navbar() {

    const location = useLocation();
    const navigate = useNavigate();

    const displayName = getDisplayNameFromToken(localStorage.getItem("token"));

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("quiz");
        localStorage.removeItem("quizDetails");
        localStorage.removeItem("result");

        navigate("/");

    };

    return (
        <div className="qg-nav">

            <Link to="/dashboard" className="qg-nav-brand">
                <span className="qg-nav-seal">Q</span>
                QuizGen AI
            </Link>

            <div className="qg-nav-links">

                {displayName && (
                    <span className="qg-nav-greeting">Hi, {displayName}</span>
                )}

                <Link
                    to="/dashboard"
                    className={`qg-nav-link ${location.pathname === "/dashboard" ? "is-active" : ""}`}
                >
                    Dashboard
                </Link>

                <Link
                    to="/history"
                    className={`qg-nav-link ${location.pathname === "/history" ? "is-active" : ""}`}
                >
                    History
                </Link>

                <button className="qg-nav-logout" onClick={logout}>
                    Log out
                </button>

            </div>

        </div>
    );
}

export default Navbar;
