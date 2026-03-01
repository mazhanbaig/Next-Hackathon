import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
    headers: {
        "Content-Type": "application/json",
    },
});

// Add token to requests if it exists
api.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
            const { token } = JSON.parse(userInfo);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;