import axios from "axios";

const api = axios.create({
    baseURL: "https://institute-workshops-beaver-soldiers.trycloudflare.com/api",
    headers: {
        "Content-Type": "application/json"
    }
});

export default api;