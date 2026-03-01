import api from "./api";

interface RegisterData {
    name: string;
    email: string;
    password: string;
    role: string;
    specialization?: string;
    age?: number | string;
    gender?: string;
}

interface LoginResponse {
    success: boolean;
    message: string;
    data?: {
        user: {
            _id: string;
            name: string;
            email: string;
            role: string;
        };
        token: string;
    };
}

const registerUser = async (data: RegisterData) => {
    try {
        const res = await api.post("/api/auth/register", data);
        return res.data;
    } catch (error: any) {
        throw error.response?.data || { message: "Registration failed" };
    }
};

const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
    try {
        const res = await api.post("/api/auth/login", { email, password });
        return res.data;
    } catch (error: any) {
        throw error.response?.data || { message: "Login failed" };
    }
};

const logoutUser = () => {
    localStorage.removeItem("userInfo");
    window.location.href = "/auth/login";
    return true;
};

export { registerUser, loginUser, logoutUser };