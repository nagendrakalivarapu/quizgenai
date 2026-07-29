import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";
import History from "./pages/History";

import PrivateRoute from "./components/PrivateRoute";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/quiz"
                    element={
                        <PrivateRoute>
                            <Quiz />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/result"
                    element={
                        <PrivateRoute>
                            <Result />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/history"
                    element={
                        <PrivateRoute>
                            <History />
                        </PrivateRoute>
                    }
                />

            </Routes>

        </BrowserRouter>

    );

}

export default App;