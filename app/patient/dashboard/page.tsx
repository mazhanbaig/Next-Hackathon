// app/patient/dashboard/page.tsx
"use client";

import { useState } from "react";
import {
    Calendar,
    Clock,
    FileText,
    Settings,
    LogOut,
    Menu,
    Bell,
    Heart,
    Pill,
    Activity,
    User,
    ChevronRight,
    Download,
    Video,
    MessageCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { message } from "antd";

export default function PatientDashboard() {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [userInfo, setUserInfo] = useState(() => {
        if (typeof window !== 'undefined') {
            return JSON.parse(localStorage.getItem('userInfo') || '{}');
        }
        return {};
    });

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        message.success('Logged out successfully');
        router.push('/auth/login');
    };

    const upcomingAppointments = [
        { date: "2024-01-20", time: "10:30 AM", doctor: "Dr. Sarah Johnson", specialty: "Cardiologist", status: "confirmed" },
        { date: "2024-01-25", time: "02:15 PM", doctor: "Dr. Michael Chen", specialty: "Dermatologist", status: "pending" },
        { date: "2024-02-01", time: "09:00 AM", doctor: "Dr. Emily Brown", specialty: "General Physician", status: "confirmed" },
    ];

    const recentPrescriptions = [
        { date: "2024-01-15", doctor: "Dr. Sarah Johnson", medication: "Amoxicillin 500mg", dosage: "Twice daily", refillable: true },
        { date: "2024-01-10", doctor: "Dr. Michael Chen", medication: "Lisinopril 10mg", dosage: "Once daily", refillable: false },
    ];

    const medicalRecords = [
        { date: "2024-01-15", type: "Blood Test", doctor: "Dr. Sarah Johnson", status: "Available" },
        { date: "2024-01-05", type: "X-Ray Report", doctor: "Dr. Robert Wilson", status: "Available" },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-64'
                }`}>
                <div className="flex flex-col h-full">
                    {/* Patient Profile */}
                    <div className="p-4 border-b text-center">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-2">
                            {userInfo.name?.charAt(0) || 'P'}
                        </div>
                        <h2 className="font-semibold">{userInfo.name || 'John Doe'}</h2>
                        <p className="text-xs text-gray-500">Patient ID: #P-12345</p>
                        <p className="text-xs text-green-600 mt-1">● Active Member</p>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4">
                        <ul className="space-y-2">
                            <li>
                                <Link href="/patient/dashboard" className="flex items-center gap-3 px-4 py-3 text-blue-600 bg-blue-50 rounded-lg">
                                    <Activity className="w-5 h-5" />
                                    <span className="font-medium">Dashboard</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/patient/appointments" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
                                    <Calendar className="w-5 h-5" />
                                    <span>Appointments</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/patient/prescriptions" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
                                    <Pill className="w-5 h-5" />
                                    <span>Prescriptions</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/patient/records" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
                                    <FileText className="w-5 h-5" />
                                    <span>Medical Records</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/patient/doctors" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
                                    <User className="w-5 h-5" />
                                    <span>My Doctors</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/patient/billing" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
                                    <Heart className="w-5 h-5" />
                                    <span>Billing</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/patient/settings" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
                                    <Settings className="w-5 h-5" />
                                    <span>Settings</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg w-full"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
                {/* Header */}
                <header className="bg-white shadow-sm sticky top-0 z-40">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <h1 className="text-xl font-semibold">My Health Dashboard</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                                <MessageCircle className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="p-6">
                    {/* Welcome Banner */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white mb-8">
                        <h2 className="text-2xl font-bold mb-2">Welcome back, {userInfo.name || 'John'}!</h2>
                        <p className="text-blue-100 mb-4">Your next appointment is tomorrow at 10:30 AM with Dr. Sarah Johnson</p>
                        <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                            View Details
                        </button>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <button className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <p className="font-medium">Book Appointment</p>
                                <p className="text-xs text-gray-500">Schedule a visit</p>
                            </div>
                        </button>
                        <button className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                                <Video className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <p className="font-medium">Video Consult</p>
                                <p className="text-xs text-gray-500">Talk to doctor</p>
                            </div>
                        </button>
                        <button className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                                <Pill className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <p className="font-medium">Refill Prescription</p>
                                <p className="text-xs text-gray-500">Order medication</p>
                            </div>
                        </button>
                        <button className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center gap-3">
                            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <p className="font-medium">View Records</p>
                                <p className="text-xs text-gray-500">Access medical history</p>
                            </div>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Upcoming Appointments */}
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
                                <Link href="/patient/appointments" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
                                    View All <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {upcomingAppointments.map((apt, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border-b last:border-0">
                                        <div className="flex items-center gap-4">
                                            <div className="text-center">
                                                <p className="text-sm font-medium text-gray-600">{new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                                <p className="text-xs text-gray-400">{apt.time}</p>
                                            </div>
                                            <div>
                                                <p className="font-medium">{apt.doctor}</p>
                                                <p className="text-sm text-gray-500">{apt.specialty}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 text-xs rounded-full ${apt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {apt.status}
                                            </span>
                                            <button className="p-2 hover:bg-blue-50 rounded-lg text-blue-600">
                                                <Video className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Prescriptions */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4">Recent Prescriptions</h2>
                            <div className="space-y-4">
                                {recentPrescriptions.map((pres, index) => (
                                    <div key={index} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="font-medium">{pres.medication}</p>
                                            <span className="text-xs text-gray-400">{pres.date}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{pres.dosage}</p>
                                        <p className="text-xs text-gray-500 mb-3">Dr. {pres.doctor}</p>
                                        {pres.refillable && (
                                            <button className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                                Request Refill <ChevronRight className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Medical Records */}
                        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm p-6 mt-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold">Recent Medical Records</h2>
                                <Link href="/patient/records" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
                                    View All <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {medicalRecords.map((record, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow">
                                        <div>
                                            <p className="font-medium">{record.type}</p>
                                            <p className="text-sm text-gray-500">{record.doctor}</p>
                                            <p className="text-xs text-gray-400 mt-1">{record.date}</p>
                                        </div>
                                        <button className="p-2 hover:bg-blue-50 rounded-lg text-blue-600">
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}