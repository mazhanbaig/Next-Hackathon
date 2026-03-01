'use client';

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { message } from "antd";
import {
    Users, Calendar, Search, Edit, Trash2, X,
    Stethoscope, ChevronRight, Heart, FileText, CreditCard, LogOut
} from "lucide-react";
import api from "@/config/api";

type UserInfo = {
    name: string;
    email: string;
    role: string;
};

type Doctor = {
    _id: string;
    name: string;
    specialization: string;
    bio?: string;
    userId?: { _id: string; email: string };
};

type Patient = {
    _id: string;
    name: string;
    age: number;
    gender: string;
    contact?: string;
};

export default function AdminDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [greeting, setGreeting] = useState("");
    const [activeTab, setActiveTab] = useState<'overview' | 'doctors' | 'patients'>('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<Doctor | Patient | null>(null);
    const [modalType, setModalType] = useState<'doctor' | 'patient'>('doctor');
    const [formData, setFormData] = useState<any>({
        name: '',
        userId: '',
        specialization: '',
        bio: '',
        age: '',
        gender: '',
        contact: '',
        email: ''
    });

    const router = useRouter();

    // Greeting based on time
    useEffect(() => {
        const hour = new Date().getHours();
        setGreeting(hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening");
    }, []);

    // Auth check
    useEffect(() => {
        const userStr = localStorage.getItem('userInfo');
        if (!userStr) {
            message.error('Please login first');
            router.push('/auth/login');
            return;
        }
        const user = JSON.parse(userStr);
        if (user.role !== 'admin') {
            message.error('Access denied. Admin only.');
            router.push('/auth/login');
            return;
        }
        setUserInfo(user);
    }, [router]);

    // Fetch data
    useEffect(() => {
        if (userInfo) fetchData();
    }, [userInfo]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const doctorsRes = await api.get('/api/doctor/');
            setDoctors(doctorsRes.data?.data || []);

            const patientsRes = await api.get('/api/patient/');
            setPatients(patientsRes.data?.data || []);
        } catch (error: any) {
            console.error(error);
            message.error('Failed to fetch data from server');
        } finally {
            setLoading(false);
        }
    };

    // Modal handlers
    const openAddModal = (type: 'doctor' | 'patient') => {
        setModalType(type);
        setEditingItem(null);
        setFormData({ name: '', userId: '', specialization: '', bio: '', age: '', gender: '', contact: '', email: '' });
        setShowModal(true);
    };

    const openEditModal = (item: Doctor | Patient, type: 'doctor' | 'patient') => {
        setModalType(type);
        setEditingItem(item);
        if (type === 'doctor') {
            setFormData({
                name: item.name,
                userId: (item as Doctor).userId?._id || '',
                specialization: (item as Doctor).specialization,
                bio: (item as Doctor).bio || '',
                email: (item as Doctor).userId?.email || ''
            });
        } else {
            setFormData({
                name: item.name,
                age: (item as Patient).age,
                gender: (item as Patient).gender,
                contact: (item as Patient).contact || ''
            });
        }
        setShowModal(true);
    };

    // Submit form
    const handleSubmit = async () => {
        try {
            let response;
            if (modalType === 'doctor') {
                if (editingItem) {
                    response = await api.put(`/api/doctor/${editingItem._id}`, { name: formData.name, specialization: formData.specialization, bio: formData.bio });
                } else {
                    response = await api.post('/api/doctor/', formData);
                }
            } else {
                if (editingItem) {
                    response = await api.put(`/api/patient/${editingItem._id}`, formData);
                } else {
                    response = await api.post('/api/patient/', formData);
                }
            }
            if (response.data.success) {
                message.success(`${modalType} ${editingItem ? 'updated' : 'added'} successfully`);
                setShowModal(false);
                fetchData();
            }
        } catch (error: any) {
            console.error(error);
            message.error('Operation failed');
        }
    };

    const handleDelete = async (id: string, type: 'doctor' | 'patient') => {
        if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
        try {
            const response = await api.delete(`/api/${type}/${id}`);
            if (response.data.success) {
                message.success(`${type} deleted successfully`);
                fetchData();
            }
        } catch (error: any) {
            console.error(error);
            message.error(`Failed to delete ${type}`);
        }
    };

    const viewDetails = (id: string, type: 'doctor' | 'patient') => {
        router.push(`/admin/${type}s/${id}`);
    };

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        router.push('/auth/login');
    };

    const filteredDoctors = useMemo(() => doctors.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.specialization.toLowerCase().includes(searchTerm.toLowerCase())), [doctors, searchTerm]);
    const filteredPatients = useMemo(() => patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.gender.toLowerCase().includes(searchTerm.toLowerCase())), [patients, searchTerm]);

    const stats = useMemo(() => [
        { title: "Total Doctors", value: doctors.length, icon: <Stethoscope className="h-5 w-5 text-blue-600" />, bgColor: "bg-gradient-to-br from-blue-100 to-blue-50", textColor: "text-blue-600" },
        { title: "Total Patients", value: patients.length, icon: <Users className="h-5 w-5 text-purple-600" />, bgColor: "bg-gradient-to-br from-purple-100 to-purple-50", textColor: "text-purple-600" },
        { title: "Appointments", value: "0", icon: <Calendar className="h-5 w-5 text-green-600" />, bgColor: "bg-gradient-to-br from-green-100 to-green-50", textColor: "text-green-600" },
        { title: "Revenue", value: "$0", icon: <CreditCard className="h-5 w-5 text-amber-600" />, bgColor: "bg-gradient-to-br from-amber-100 to-amber-50", textColor: "text-amber-600" }
    ], [doctors, patients]);

    const quickActions = [
        { icon: <Stethoscope className="h-6 w-6" />, label: "Add Doctor", description: "Register new doctor", textColor: "text-blue-600", bgColor: "bg-gradient-to-br from-blue-100 to-blue-50", action: () => openAddModal('doctor') },
        { icon: <Users className="h-6 w-6" />, label: "Add Patient", description: "Register new patient", textColor: "text-purple-600", bgColor: "bg-gradient-to-br from-purple-100 to-purple-50", action: () => openAddModal('patient') },
        { icon: <Calendar className="h-6 w-6" />, label: "Appointments", description: "Schedule appointments", textColor: "text-green-600", bgColor: "bg-gradient-to-br from-green-100 to-green-50", action: () => router.push('/admin/appointments') },
        { icon: <FileText className="h-6 w-6" />, label: "Reports", description: "View analytics", textColor: "text-amber-600", bgColor: "bg-gradient-to-br from-amber-100 to-amber-50", action: () => router.push('/admin/reports') }
    ];

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-gray-500">Loading...</div></div>;

    return (
        <div className="min-h-screen bg-gray-50">            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
                <div className="px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600">
                                <Heart className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                    Clinic Management
                                </h1>
                                <p className="text-xs text-gray-500">Admin Dashboard</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-semibold">
                                    {userInfo?.name?.charAt(0) || 'A'}
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-sm font-medium text-gray-900">{userInfo?.name || 'Admin'}</p>
                                    <p className="text-xs text-gray-500">{userInfo?.email || ''}</p>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <LogOut className="h-5 w-5 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="p-4 sm:p-6 lg:p-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <div className="relative">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-6 h-px bg-gradient-to-r from-purple-500 to-blue-500"></div>
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">Dashboard</span>
                                    <div className="w-6 h-px bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                                </div>

                                <div className="space-y-2">
                                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                                        {greeting}, <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                            {userInfo?.name?.split(' ')[0] || 'Admin'}
                                        </span>
                                    </h1>
                                    <p className="text-gray-600 max-w-2xl">
                                        Welcome to your clinic management dashboard. Monitor doctors, patients, and appointments all in one place.
                                    </p>
                                </div>
                            </div>

                            {/* Search Bar */}
                            <div className="w-full lg:w-96">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search doctors or patients..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="relative group">
                            <div className="relative bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    </div>
                                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                        {stat.icon}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {quickActions.map((action, index) => (
                        <button
                            key={index}
                            onClick={action.action}
                            className="group relative bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-purple-200 transition-all duration-300 text-left"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-lg ${action.bgColor}`}>
                                    <div className={action.textColor}>
                                        {action.icon}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{action.label}</h3>
                                    <p className="text-sm text-gray-500">{action.description}</p>
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </button>
                    ))}
                </div>

                {/* Tabs */}
                <div className="mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex gap-8">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`pb-4 px-1 font-medium text-sm transition-colors relative ${activeTab === 'overview'
                                        ? 'text-purple-600 border-b-2 border-purple-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('doctors')}
                                className={`pb-4 px-1 font-medium text-sm transition-colors relative ${activeTab === 'doctors'
                                        ? 'text-purple-600 border-b-2 border-purple-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Doctors ({doctors?.length || 0})
                            </button>
                            <button
                                onClick={() => setActiveTab('patients')}
                                className={`pb-4 px-1 font-medium text-sm transition-colors relative ${activeTab === 'patients'
                                        ? 'text-purple-600 border-b-2 border-purple-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Patients ({patients?.length || 0})
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Content */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Doctors */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-lg">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                        Recent Doctors
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-1">Latest joined doctors</p>
                                </div>
                                <button
                                    onClick={() => setActiveTab('doctors')}
                                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                                >
                                    View All
                                </button>
                            </div>

                            <div className="space-y-4">
                                {(doctors || []).slice(0, 3).map((doctor:any) => (
                                    <div
                                        key={doctor._id}
                                        className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-sm transition-all cursor-pointer"
                                        onClick={() => viewDetails(doctor._id, 'doctor')}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                                <Stethoscope className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{doctor.name}</p>
                                                <p className="text-sm text-gray-500">{doctor.specialization}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openEditModal(doctor, 'doctor');
                                                }}
                                                className="p-1 hover:bg-gray-100 rounded"
                                            >
                                                <Edit className="h-4 w-4 text-gray-600" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(doctor._id, 'doctor');
                                                }}
                                                className="p-1 hover:bg-red-100 rounded"
                                            >
                                                <Trash2 className="h-4 w-4 text-red-600" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {(doctors || []).length === 0 && (
                                    <p className="text-center text-gray-500 py-4">No doctors found</p>
                                )}
                            </div>
                        </div>

                        {/* Recent Patients */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-lg">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                        Recent Patients
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-1">Latest registered patients</p>
                                </div>
                                <button
                                    onClick={() => setActiveTab('patients')}
                                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                                >
                                    View All
                                </button>
                            </div>

                            <div className="space-y-4">
                                {(patients || []).slice(0, 3).map((patient) => (
                                    <div
                                        key={patient._id}
                                        className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-sm transition-all cursor-pointer"
                                        onClick={() => viewDetails(patient._id, 'patient')}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                                <Users className="h-5 w-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{patient.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {patient.age} years • {patient.gender}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openEditModal(patient, 'patient');
                                                }}
                                                className="p-1 hover:bg-gray-100 rounded"
                                            >
                                                <Edit className="h-4 w-4 text-gray-600" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(patient._id, 'patient');
                                                }}
                                                className="p-1 hover:bg-red-100 rounded"
                                            >
                                                <Trash2 className="h-4 w-4 text-red-600" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {(patients || []).length === 0 && (
                                    <p className="text-center text-gray-500 py-4">No patients found</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'doctors' && (
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bio</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredDoctors.map((doctor) => (
                                        <tr key={doctor._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                                        <Stethoscope className="h-4 w-4 text-blue-600" />
                                                    </div>
                                                    <span className="font-medium text-gray-900">{doctor.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                    {doctor.specialization}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {doctor.bio || 'No bio'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => viewDetails(doctor._id, 'doctor')}
                                                        className="p-1 hover:bg-gray-100 rounded"
                                                    >
                                                        <Users className="h-4 w-4 text-gray-600" />
                                                    </button>
                                                    <button
                                                        onClick={() => openEditModal(doctor, 'doctor')}
                                                        className="p-1 hover:bg-gray-100 rounded"
                                                    >
                                                        <Edit className="h-4 w-4 text-blue-600" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(doctor._id, 'doctor')}
                                                        className="p-1 hover:bg-red-100 rounded"
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-600" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredDoctors.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                                No doctors found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'patients' && (
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredPatients.map((patient) => (
                                        <tr key={patient._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                                        <Users className="h-4 w-4 text-purple-600" />
                                                    </div>
                                                    <span className="font-medium text-gray-900">{patient.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{patient.age}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${patient.gender?.toLowerCase() === 'male'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : patient.gender?.toLowerCase() === 'female'
                                                            ? 'bg-pink-100 text-pink-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {patient.gender}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{patient.contact || 'N/A'}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => viewDetails(patient._id, 'patient')}
                                                        className="p-1 hover:bg-gray-100 rounded"
                                                    >
                                                        <Users className="h-4 w-4 text-gray-600" />
                                                    </button>
                                                    <button
                                                        onClick={() => openEditModal(patient, 'patient')}
                                                        className="p-1 hover:bg-gray-100 rounded"
                                                    >
                                                        <Edit className="h-4 w-4 text-blue-600" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(patient._id, 'patient')}
                                                        className="p-1 hover:bg-red-100 rounded"
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-600" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredPatients.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                                No patients found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                {editingItem ? 'Edit' : 'Add'} {modalType === 'doctor' ? 'Doctor' : 'Patient'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5 text-gray-600" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {modalType === 'doctor' ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="Enter doctor name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            User ID
                                        </label>
                                        <input
                                            type="text"
                                            name="userId"
                                            value={formData.userId}
                                            onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="Enter user ID"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Specialization
                                        </label>
                                        <input
                                            type="text"
                                            name="specialization"
                                            value={formData.specialization}
                                            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="Enter specialization"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Bio
                                        </label>
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            rows={3}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="Enter bio"
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="Enter patient name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Age
                                        </label>
                                        <input
                                            type="number"
                                            name="age"
                                            value={formData.age}
                                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="Enter age"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Gender
                                        </label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="">Select gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Contact
                                        </label>
                                        <input
                                            type="text"
                                            name="contact"
                                            value={formData.contact}
                                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="Enter contact number"
                                        />
                                    </div>
                                </>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={handleSubmit}
                                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                                >
                                    {editingItem ? 'Update' : 'Save'}
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}