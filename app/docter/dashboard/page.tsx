// app/doctor/dashboard/page.tsx
"use client";

import { useState } from "react";
import {
    Calendar,
    Clock,
    Users,
    FileText,
    Settings,
    LogOut,
    Menu,
    Bell,
    Search,
    Video,
    MessageCircle,
    ChevronRight,
    Activity,
    Pill,
    Heart
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { message } from "antd";

export default function DoctorDashboard() {
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

    const todayAppointments = [
        { time: "09:00 AM", patient: "Alice Johnson", type: "Check-up", status: "confirmed" },
        { time: "10:30 AM", patient: "Bob Williams", type: "Follow-up", status: "waiting" },
        { time: "11:45 AM", patient: "Carol Davis", type: "Consultation", status: "confirmed" },
        { time: "02:00 PM", patient: "David Brown", type: "Emergency", status: "urgent" },
        { time: "03:30 PM", patient: "Eva Green", type: "Check-up", status: "confirmed" },
    ];

    const recentPatients = [
        { name: "John Smith", lastVisit: "2 days ago", condition: "Hypertension" },
        { name: "Mary Johnson", lastVisit: "3 days ago", condition: "Diabetes" },
        { name: "Robert Wilson", lastVisit: "5 days ago", condition: "Asthma" },
    ];

    const prescriptions = [
        { patient: "Sarah Parker", medication: "Amoxicillin", refill: "3 days left" },
        { patient: "Tom Harris", medication: "Lisinopril", refill: "7 days left" },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-64'
                }`}>
                <div className="flex flex-col h-full">
                    {/* Doctor Profile */}
                    <div className="p-4 border-b text-center">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-2">
                            {userInfo.name?.charAt(0) || 'D'}
                        </div>
                        <h2 className="font-semibold">{userInfo.name || 'Dr. Smith'}</h2>
                        <p className="text-xs text-gray-500">Cardiologist</p>
                        <p className="text-xs text-green-600 mt-1">● Available</p>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4">
                        <ul className="space-y-2">
                            <li>
                                <Link href="/doctor/dashboard" className="flex items-center gap-3 px-4 py-3 text-blue-600 bg-blue-50 rounded-lg">
                                    <Calendar className="w-5 h-5" />
                                    <span className="font-medium">Dashboard</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/doctor/appointments" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
                                    <Clock className="w-5 h-5" />
                                    <span>Appointments</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/doctor/patients" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
                                    <Users className="w-5 h-5" />
                                    <span>My Patients</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/doctor/prescriptions" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
                                    <Pill className="w-5 h-5" />
                                    <span>Prescriptions</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/doctor/records" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
                                    <FileText className="w-5 h-5" />
                                    <span>Medical Records</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/doctor/schedule" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
                                    <Heart className="w-5 h-5" />
                                    <span>Schedule</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/doctor/settings" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
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
                            <h1 className="text-xl font-semibold">Doctor Dashboard</h1>
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
                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Today's Patients</p>
                                    <h3 className="text-2xl font-bold mt-1">12</h3>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                    <Users className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Completed</p>
                                    <h3 className="text-2xl font-bold mt-1">8</h3>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                                    <Clock className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Pending</p>
                                    <h3 className="text-2xl font-bold mt-1">4</h3>
                                </div>
                                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600">
                                    <Calendar className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Total Patients</p>
                                    <h3 className="text-2xl font-bold mt-1">156</h3>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                                    <Activity className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Today's Schedule */}
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold">Today's Schedule</h2>
                                <Link href="/doctor/appointments" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
                                    View All <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {todayAppointments.map((apt, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border-b last:border-0">
                                        <div className="flex items-center gap-4">
                                            <div className="text-sm font-medium text-gray-600 w-16">{apt.time}</div>
                                            <div>
                                                <p className="font-medium">{apt.patient}</p>
                                                <p className="text-sm text-gray-500">{apt.type}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 text-xs rounded-full ${apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                    apt.status === 'waiting' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
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

                        {/* Recent Patients & Prescriptions */}
                        <div className="space-y-6">
                            {/* Recent Patients */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-lg font-semibold mb-4">Recent Patients</h2>
                                <div className="space-y-4">
                                    {recentPatients.map((patient, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">{patient.name}</p>
                                                <p className="text-sm text-gray-500">{patient.condition}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400">{patient.lastVisit}</p>
                                                <button className="text-xs text-blue-600 hover:underline mt-1">View</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Prescription Refills */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-lg font-semibold mb-4">Prescription Refills</h2>
                                <div className="space-y-4">
                                    {prescriptions.map((prescription, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">{prescription.patient}</p>
                                                <p className="text-sm text-gray-500">{prescription.medication}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-yellow-600">{prescription.refill}</p>
                                                <button className="text-xs text-blue-600 hover:underline mt-1">Refill</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}