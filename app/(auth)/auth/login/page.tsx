"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@/config/dbfunctions";
import { message } from "antd";
import Button from "@/component/Button";

export default function Login() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        if (!email || !password) {
            message.error("Email and password are required");
            return;
        }

        setLoading(true);
        try {
            const res = await loginUser(email, password);

            if (res.success && res.data) {
                const { user, token } = res.data;

                // Save user info
                localStorage.setItem(
                    "userInfo",
                    JSON.stringify({
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        token: token
                    })
                );

                message.success(res.message || "Login successful!");

                // Redirect based on role
                if (user.role === "admin") {
                    router.replace("/admin/dashboard");
                } else if (user.role === "doctor") {
                    router.replace("/doctor/dashboard");
                } else {
                    router.replace("/patient/dashboard");
                }
            } else {
                message.error(res.message || "Login failed");
            }
        } catch (err: any) {
            console.error("Login error:", err);
            message.error(err?.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-4">
            <div className="relative w-full max-w-3xl">
                <div className="flex flex-col lg:flex-row bg-white/95 backdrop-blur-sm rounded-xl sm:border border-gray-200 sm:shadow-lg overflow-hidden">
                    {/* Left branding */}
                    <div className="lg:w-1/2 p-8 sm:bg-gradient-to-br from-blue-50 to-cyan-50 flex flex-col justify-center">
                        <h1 className="text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent mb-4">
                            Welcome Back
                        </h1>
                        <p className="text-gray-700 font-medium text-sm">Sign in to continue</p>
                    </div>

                    {/* Login Form */}
                    <div className="lg:w-1/2 p-8 flex flex-col justify-center">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-1">Login</h2>
                            <p className="text-gray-500 text-sm">Enter your credentials to sign in</p>
                        </div>

                        <div className="mb-4 flex flex-col gap-4">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                            <Button
                                label={loading ? "Logging in..." : "Login"}
                                variant="theme2"
                                onClick={handleLogin}
                                disabled={loading}
                            />
                        </div>

                        <div className="flex justify-between text-sm">
                            <Link href="#" className="text-gray-500 hover:text-blue-600 hover:underline transition-colors">
                                Forgot password?
                            </Link>
                            <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors">
                                Create an account →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}