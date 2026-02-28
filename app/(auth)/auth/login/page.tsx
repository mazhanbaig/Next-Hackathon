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
        setLoading(true);

        try {
            const res: any = await loginUser(email, password);
            console.log(res);

            // Save user info in localStorage
            localStorage.setItem(
                "userInfo",
                JSON.stringify({
                    id: res.data.user._id,
                    email: res.data.user.email,
                    token: res.data.token,
                    role:res.data.user.role
                })
            );

            message.success(res.message); // display server success message
            router.replace("/"); // redirect to home/dashboard
        } catch (err: any) {
            console.log(err);
            // Display server error message if exists
            message.error(err.message || "Invalid credentials");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-4">
            <div className="relative w-full max-w-3xl">
                <div className="flex flex-col lg:flex-row bg-white/95 backdrop-blur-sm rounded-xl sm:border border-gray-200 sm:shadow-lg overflow-hidden">

                    {/* Left side branding */}
                    <div className="lg:w-1/2 p-8 sm:bg-gradient-to-br from-blue-50 to-cyan-50 flex flex-col justify-center">
                        <h1 className="text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent mb-4">
                            Welcome Back
                        </h1>
                        <p className="text-gray-700 font-medium text-sm">Sign in to continue</p>
                    </div>

                    {/* Right side login form */}
                    <div className="lg:w-1/2 px-8 flex flex-col justify-center">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-1">Login</h2>
                            <p className="text-gray-500 text-sm">Enter your credentials to sign in</p>
                        </div>

                        <div className="mb-4 flex flex-col gap-3">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border-b border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border-b border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                            />
                            <Button
                                label={loading ? "Logging in..." : "Login"}
                                variant="theme2"
                                onClick={handleLogin}
                            />
                        </div>

                        <div className="flex justify-between text-xs mb-4">
                            <Link
                                href="#"
                                className="text-gray-500 hover:text-blue-600 hover:underline transition-colors px-2 py-1 rounded hover:bg-blue-50"
                            >
                                Forgot password?
                            </Link>
                            <Link
                                href="/auth/signup"
                                className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors px-2 py-1 rounded hover:bg-blue-50"
                            >
                                Create an account →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background elements */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-cyan-200/10 to-blue-200/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-indigo-200/10 to-purple-200/10 rounded-full blur-2xl"></div>
            </div>
        </div>
    );
}