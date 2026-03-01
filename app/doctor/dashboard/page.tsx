'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { message } from "antd";
import {
    Users, Calendar, Search, LogOut,
    Stethoscope, Clock, UserPlus, FileText
} from "lucide-react";
import api from "@/config/api";
import { format } from "date-fns";

type UserInfo = {
    _id: string;
    name: string;
    email: string;
    role: string;
};

type Patient = {
    _id: string;
    name: string;
    age: number;
    gender: string;
    contact?: string;
};

type Appointment = {
    _id: string;
    patientId: {
        _id: string;
        name: string;
        age: number;
        gender: string;
    };
    date: string;
    time: string;
    status: string;
};

export default function DoctorDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [greeting, setGreeting] = useState("");
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: '',
        contact: ''
    });

    const router = useRouter();

    useEffect(() => {
        const hour = new Date().getHours();
        setGreeting(hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening");
    }, []);

    useEffect(() => {
        const userStr = localStorage.getItem('userInfo');
        if (!userStr) {
            router.push('/auth/login');
            return;
        }
        const user = JSON.parse(userStr);
        if (user.role !== 'doctor') {
            router.push('/auth/login');
            return;
        }
        setUserInfo(user);
    }, [router]);

    useEffect(() => {
        if (userInfo) {
            fetchData();
        }
    }, [userInfo]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [patientsRes, appointmentsRes] = await Promise.all([
                api.get('/api/patient/'),
                api.get('/api/appointment/')
            ]);

            setPatients(patientsRes.data?.data || []);

            // Filter today's appointments for this doctor
            const allAppointments = appointmentsRes.data?.data || [];
            const todayApps = allAppointments.filter((apt: Appointment) =>
                apt.date === selectedDate
            );
            setAppointments(todayApps);
        } catch (error) {
            message.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleAddPatient = async () => {
        try {
            const response = await api.post('/api/patient/', {
                name: formData.name,
                age: parseInt(formData.age),
                gender: formData.gender.toLowerCase(),
                contact: formData.contact,
                createdBy: userInfo?._id
            });

            if (response.data?.success) {
                message.success('Patient added successfully');
                setShowAddModal(false);
                setFormData({ name: '', age: '', gender: '', contact: '' });
                fetchData();
            }
        } catch (error) {
            message.error('Failed to add patient');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        router.push('/auth/login');
    };

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const todayAppointments = appointments.filter(apt => apt.date === selectedDate);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <Stethoscope className="h-6 w-6 text-blue-600" />
                        <h1 className="text-xl font-semibold text-gray-900">Doctor Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">{userInfo?.name}</span>
                        <button
                            onClick={handleLogout}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <LogOut className="h-4 w-4 text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Welcome */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {greeting}, Dr. {userInfo?.name?.split(' ')[0]}
                    </h2>
                    <p className="text-gray-600 mt-1">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Patients</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{patients.length}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Users className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Today's Appointments</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{todayAppointments.length}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <Calendar className="h-5 w-5 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {todayAppointments.filter(a => a.status === 'scheduled').length}
                                </p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <Clock className="h-5 w-5 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 transition-all text-left"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <UserPlus className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Add New Patient</h3>
                                <p className="text-sm text-gray-600">Register a new patient</p>
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={() => router.push('/doctor/appointments')}
                        className="bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 transition-all text-left"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Calendar className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">View Schedule</h3>
                                <p className="text-sm text-gray-600">Manage appointments</p>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Today's Schedule */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
                    {todayAppointments.length > 0 ? (
                        <div className="space-y-3">
                            {todayAppointments.sort((a, b) => a.time.localeCompare(b.time)).map((apt) => (
                                <div key={apt._id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <span className="font-medium text-gray-900">{apt.time}</span>
                                        <div>
                                            <p className="font-medium text-gray-900">{apt.patientId?.name}</p>
                                            <p className="text-sm text-gray-600">{apt.patientId?.age} years • {apt.patientId?.gender}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {apt.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-4">No appointments scheduled for today</p>
                    )}
                </div>

                {/* Patients List */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">My Patients</h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search patients..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-y border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredPatients.map((patient) => (
                                    <tr key={patient._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-900">{patient.name}</td>
                                        <td className="px-4 py-3 text-gray-600">{patient.age}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${patient.gender === 'male' ? 'bg-blue-100 text-blue-700' :
                                                    patient.gender === 'female' ? 'bg-pink-100 text-pink-700' :
                                                        'bg-gray-100 text-gray-700'
                                                }`}>
                                                {patient.gender}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{patient.contact || 'N/A'}</td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => router.push(`/doctor/patients/${patient._id}`)}
                                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredPatients.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                            No patients found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Patient Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Patient</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter patient name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                                <input
                                    type="number"
                                    value={formData.age}
                                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter age"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                                <input
                                    type="text"
                                    value={formData.contact}
                                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter contact number"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleAddPatient}
                                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Add Patient
                            </button>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}