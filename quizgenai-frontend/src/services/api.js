// src/api/api.js
import axios from "axios";

const api = axios.create({
    baseURL: "https://quizgenai-backend-ua85.onrender.com/api",
    headers: {
        "Content-Type": "application/json"
    }
});

export default api;