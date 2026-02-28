"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/config/dbfunctions";
import { message } from "antd";
import { Mail } from "lucide-react";
import Button from "@/component/Button";

export default function Signup() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async () => {
        setLoading(true);

        try {
            const res: any = await registerUser(name,email, password)
            console.log(res);

            localStorage.setItem(
                "userInfo",
                JSON.stringify({
                    id: res.data.user._id,
                    token: res.data.token,
                    email: res.data.user.email,
                })
            );
            message.success(res.message);
            router.replace('/')
        } catch (err: any) {
            console.log(err)
            message.error(err.message || "Something went wrong");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-4">
            <div className="relative w-full max-w-3xl">
                {/* Compact Horizontal container */}
                <div className="flex flex-col lg:flex-row bg-white/95 backdrop-blur-sm rounded-xl sm:border border-gray-200 sm:shadow-lg overflow-hidden">

                    {/* Left side - Compact Branding */}
                    <div className="lg:w-1/2 p-8 sm:bg-gradient-to-br from-blue-50 to-cyan-50 flex flex-col justify-center">
                        <div className="mb-6">
                            <div className="relative inline-block mb-4">
                                <h1 className="text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                                    Hello
                                </h1>

                                <div className="absolute -top-1 -left-1 w-3 h-3 bg-cyan-400/20 rounded"></div>
                                <div className="absolute -bottom-0.5 -right-2 w-2 h-2 bg-blue-400/20 rounded"></div>
                            </div>

                            <p className="text-gray-700 font-medium mb-1 text-sm">
                                Intelligent hello
                            </p>
                            <p className="text-gray-500 text-xs">
                                Start your hello
                            </p>
                        </div>

                        {/* Compact Features */}
                        <div className="hidden sm:block space-y-3 mb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                                    <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium text-gray-800">Secure & Encrypted</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-cyan-100 rounded flex items-center justify-center flex-shrink-0">
                                    <svg className="w-3 h-3 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium text-gray-800">Real-time Sync</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-indigo-100 rounded flex items-center justify-center flex-shrink-0">
                                    <svg className="w-3 h-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium text-gray-800">Fast Setup</p>
                            </div>
                        </div>

                        {/* Compact Stats */}
                        <div className="hidden sm:grid grid-cols-3 gap-3">
                            <div className="bg-white/50 rounded p-2 text-center">
                                <div className="text-lg font-bold text-blue-600">Free</div>
                                <div className="text-xs text-gray-500">Forever Plan</div>
                            </div>
                            <div className="bg-white/50 rounded p-2 text-center">
                                <div className="text-lg font-bold text-cyan-600">5K+</div>
                                <div className="text-xs text-gray-500">New Users</div>
                            </div>
                            <div className="bg-white/50 rounded p-2 text-center">
                                <div className="text-lg font-bold text-indigo-600">14-day</div>
                                <div className="text-xs text-gray-500">Trial</div>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Compact Signup form */}
                    <div className="lg:w-1/2 px-8 flex flex-col justify-center">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-1">Create Your Account</h2>
                            <p className="text-gray-500 text-sm">Sign up to start managing hello</p>
                        </div>

                        {/* Compact Signup form Inputs */}
                        <div className="mb-4 flex flex-col gap-3">
                            <input
                                type="email"
                                placeholder="Name"
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
                            <Button
                                label={loading ? 'Creating account...' : 'Create Account'}
                                variant="theme2"
                                onClick={handleSignup}
                            />
                        </div>

                        {/* Compact Links Section */}
                        <div className="flex justify-between text-xs mb-4">
                            <Link
                                href="#"
                                className="text-gray-500 hover:text-blue-600 hover:underline transition-colors px-2 py-1 rounded hover:bg-blue-50"
                            >
                                Need help?
                            </Link>
                            <Link
                                href="/auth/login"
                                className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors px-2 py-1 rounded hover:bg-blue-50"
                            >
                                Already have an account? →
                            </Link>
                        </div>

                        {/* Compact Social proof */}
                        <div className="mb-4">
                            <div className="flex items-center justify-center gap-3">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="w-7 h-7 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full border-2 border-white"></div>
                                    ))}
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-700">Join 5,000+ new users this month</p>
                                </div>
                            </div>
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
