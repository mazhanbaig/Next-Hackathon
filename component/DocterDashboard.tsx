"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/config/api";
import { Calendar, Users, FileText, LogOut, Menu, X } from "lucide-react";

export default function DoctorDashboard() {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("appointments");
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        appointments: [],
        patients: [],
        prescriptions: []
    });

    // Fetch data on load
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [appRes, patRes, preRes] = await Promise.all([
                api.get("/api/appointments"),
                api.get("/api/patients"),
                api.get("/api/prescriptions")
            ]);

            setData({
                appointments: appRes.data.data || [],
                patients: patRes.data.data || [],
                prescriptions: preRes.data.data || []
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        router.push("/auth/login");
    };

    // Stats
    const stats = {
        todayAppointments: data.appointments.filter((a:any) =>
            new Date(a.date).toDateString() === new Date().toDateString()
        ).length,
        totalPatients: data.patients.length,
        totalPrescriptions: data.prescriptions.length
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile menu button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 bg-blue-500 text-white p-2 rounded-lg"
            >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-200 z-40`}>
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Doctor Panel</h2>
                    <p className="text-sm text-gray-500 mt-1">Welcome back!</p>
                </div>

                <nav className="p-4">
                    <button
                        onClick={() => { setActiveTab("appointments"); setSidebarOpen(false); }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 ${activeTab === "appointments" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        <Calendar size={20} />
                        <span>Appointments</span>
                    </button>

                    <button
                        onClick={() => { setActiveTab("patients"); setSidebarOpen(false); }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 ${activeTab === "patients" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        <Users size={20} />
                        <span>Patients</span>
                    </button>

                    <button
                        onClick={() => { setActiveTab("prescriptions"); setSidebarOpen(false); }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 ${activeTab === "prescriptions" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        <FileText size={20} />
                        <span>Prescriptions</span>
                    </button>
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:ml-64 p-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg mr-4">
                                <Calendar className="text-blue-600" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Today's Appointments</p>
                                <p className="text-2xl font-semibold">{stats.todayAppointments}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-lg mr-4">
                                <Users className="text-green-600" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Patients</p>
                                <p className="text-2xl font-semibold">{stats.totalPatients}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 rounded-lg mr-4">
                                <FileText className="text-purple-600" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Prescriptions</p>
                                <p className="text-2xl font-semibold">{stats.totalPrescriptions}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Appointments Tab */}
                {activeTab === "appointments" && (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b">
                            <h2 className="text-lg font-semibold">Today's Appointments</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {data.appointments.map((app:any) => (
                                        <tr key={app._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">{app.patientId?.name}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-500">
                                                    {new Date(app.date).toLocaleTimeString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs rounded-full ${app.status === "confirmed" ? "bg-green-100 text-green-800" :
                                                        app.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                                            "bg-gray-100 text-gray-800"
                                                    }`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Patients Tab */}
                {activeTab === "patients" && (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b">
                            <h2 className="text-lg font-semibold">My Patients</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {data.patients.map((patient:any) => (
                                        <tr key={patient._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{patient.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{patient.age}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{patient.gender}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{patient.contact?.phone}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Prescriptions Tab */}
                {activeTab === "prescriptions" && (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b">
                            <h2 className="text-lg font-semibold">Recent Prescriptions</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diagnosis</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {data.prescriptions.map((pres:any) => (
                                        <tr key={pres._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(pres.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{pres.patientId?.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{pres.diagnosis}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}