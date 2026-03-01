"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { message } from "antd";
import Button from "@/component/Button";
import { registerUser } from "@/config/dbfunctions";
import Link from "next/link";

export default function Signup() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"patient" | "doctor" | "admin">("patient");
    const [age, setAge] = useState<string>("");
    const [gender, setGender] = useState<string>("");
    const [specialization, setSpecialization] = useState("");

    const handleSignup = async () => {
        // Validation
        if (!name || !email || !password) {
            message.error("Name, email and password are required");
            return;
        }

        if (role === "patient" && (!age || !gender)) {
            message.error("Age and gender are required for patients");
            return;
        }

        if (role === "doctor" && !specialization) {
            message.error("Specialization is required for doctors");
            return;
        }

        setLoading(true);
        try {
            const res = await registerUser({
                name,
                email,
                password,
                role,
                age: role === "patient" ? age : undefined,
                gender: role === "patient" ? gender : undefined,
                specialization: role === "doctor" ? specialization : undefined,
            });

            if (res.success) {
                message.success(res.message || "Registration successful!");

                // Auto login after signup
                localStorage.setItem(
                    "userInfo",
                    JSON.stringify({
                        id: res.data.user._id,
                        name: res.data.user.name,
                        email: res.data.user.email,
                        role: res.data.user.role,
                        token: res.data.token,
                    })
                );

                // Redirect based on role
                setTimeout(() => {
                    if (res.data.user.role === "admin") {
                        router.replace("/admin/dashboard");
                    } else if (res.data.user.role === "doctor") {
                        router.replace("/doctor/dashboard");
                    } else {
                        router.replace("/patient/dashboard");
                    }
                }, 1000);
            } else {
                message.error(res.message || "Registration failed");
            }
        } catch (err: any) {
            console.error("Signup error:", err);
            message.error(err?.message || "Registration failed. Please try again.");
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
                            Join Our Clinic
                        </h1>
                        <p className="text-gray-700 font-medium text-sm">
                            Create an account to manage patients, appointments, and more
                        </p>
                    </div>

                    {/* Signup Form */}
                    <div className="lg:w-1/2 p-8 flex flex-col justify-center max-h-[80vh] overflow-y-auto">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-1">Sign Up</h2>
                            <p className="text-gray-500 text-sm">Fill in your details to create an account</p>
                        </div>

                        <div className="mb-4 flex flex-col gap-4">
                            <input
                                type="text"
                                placeholder="Full Name *"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={loading}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                            <input
                                type="email"
                                placeholder="Email *"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                            <input
                                type="password"
                                placeholder="Password *"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />

                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value as "patient" | "doctor" | "admin")}
                                disabled={loading}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                            >
                                <option value="patient">Patient</option>
                                <option value="doctor">Doctor</option>
                                <option value="admin">Admin</option>
                            </select>

                            {role === "patient" && (
                                <>
                                    <input
                                        type="number"
                                        placeholder="Age *"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        disabled={loading}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    />
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        disabled={loading}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    >
                                        <option value="">Select Gender *</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </>
                            )}

                            {role === "doctor" && (
                                <input
                                    type="text"
                                    placeholder="Specialization *"
                                    value={specialization}
                                    onChange={(e) => setSpecialization(e.target.value)}
                                    disabled={loading}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                                />
                            )}

                            <Button
                                label={loading ? "Creating account..." : "Sign Up"}
                                variant="theme2"
                                onClick={handleSignup}
                                disabled={loading}
                            />
                        </div>

                        <div className="text-center text-sm">
                            <span className="text-gray-600">Already have an account? </span>
                            <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 hover:underline font-medium">
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}