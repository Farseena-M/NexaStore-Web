import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})


axiosInstance.interceptors.request.use((config) => {
    const Token = localStorage.getItem('token');
    if (Token) {
        config.headers.Authorization = `Bearer ${Token}`
    }
    return config;
})