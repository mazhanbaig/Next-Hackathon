"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { message } from "antd";
import Button from "@/component/Button";
import { registerUser } from "@/config/dbfunctions";

export default function Signup() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"patient" | "doctor" | "admin">("patient"); // default role

    const handleSignup = async () => {
        if (!email || !password) return message.error("Email and password are required");

        setLoading(true);

        try {
            const res = await registerUser(name, email, password, role );

            localStorage.setItem(
                "userInfo",
                JSON.stringify({
                    id: res.data.user._id,
                    email: res.data.user.email,
                    role: res.data.user.role,
                    token: res.data.token,
                })
            );

            message.success(res.message);
            router.replace("/"); // redirect to dashboard
        } catch (err: any) {
            console.log(err);
            message.error(err.message || "Signup failed");
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
                            Join Our Clinic
                        </h1>
                        <p className="text-gray-700 font-medium text-sm">
                            Create an account to manage patients, appointments, and more
                        </p>
                    </div>

                    {/* Right side signup form */}
                    <div className="lg:w-1/2 px-8 flex flex-col justify-center">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-1">Sign Up</h2>
                            <p className="text-gray-500 text-sm">Fill in your details to create an account</p>
                        </div>

                        <div className="mb-4 flex flex-col gap-3">
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 border-b border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                            />
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

                            {/* Role selector */}
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value as "patient" | "doctor" | "admin")}
                                className="w-full px-4 py-2 border-b border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                            >
                                <option value="patient">Patient</option>
                                <option value="doctor">Doctor</option>
                                <option value="admin">Admin</option>
                            </select>

                            <Button
                                label={loading ? "Signing up..." : "Sign Up"}
                                variant="theme2"
                                onClick={handleSignup}
                            />
                        </div>

                        <div className="flex justify-between text-xs mb-4">
                            <p className="text-gray-500 px-2 py-1">
                                Already have an account?{" "}
                                <a href="/auth/login" className="text-blue-600 hover:text-blue-700 hover:underline">
                                    Login
                                </a>
                            </p>
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