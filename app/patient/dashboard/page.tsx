'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { message } from 'antd';
import {
    Calendar, Heart, Activity, FileText, Mail, Phone,
    User, LogOut, Clock, AlertCircle, Pill, Droplet,
    Stethoscope, ChevronRight
} from 'lucide-react';
import api from '@/config/api';
import { format } from 'date-fns';

type UserInfo = {
    _id: string;
    name: string;
    email: string;
    role: string;
    token: string;
};

type Appointment = {
    _id: string;
    doctorId: {
        _id: string;
        name: string;
        specialization: string;
    };
    date: string;
    time: string;
    status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
    type: string;
    notes?: string;
};

type MedicalRecord = {
    _id: string;
    type: string;
    details: string;
    timestamp: string;
};

type PatientData = {
    _id: string;
    name: string;
    age: number;
    gender: string;
    contact: string;
    bloodGroup?: string;
    allergies?: string;
    medications?: string;
    medicalHistory: MedicalRecord[];
};

export default function PatientDashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [patientData, setPatientData] = useState<PatientData | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        setGreeting(hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening');
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
        if (user.role !== 'patient') {
            message.error('Access denied. Patient only.');
            router.push('/auth/login');
            return;
        }

        setUserInfo(user);
    }, [router]);

    // Fetch patient data
    useEffect(() => {
        if (userInfo) {
            fetchPatientData();
            fetchAppointments();
        }
    }, [userInfo]);

    const fetchPatientData = async () => {
        try {
            // First get all patients to find the one associated with this user
            const res = await api.get('/api/patient/');
            const patients = res.data?.data || [];

            // Find patient created by this user
            const patient = patients.find((p: any) => p.createdBy === userInfo?._id);

            if (patient) {
                setPatientData(patient);
            } else {
                message.error('Patient profile not found');
            }
        } catch (error) {
            console.error('Error fetching patient:', error);
            message.error('Failed to load patient data');
        } finally {
            setLoading(false);
        }
    };

    const fetchAppointments = async () => {
        try {
            const res = await api.get('/api/appointment/');
            const allAppointments = res.data?.data || [];

            // Filter appointments for this patient
            const patientAppointments = allAppointments.filter(
                (apt:any) => apt.patientId === patientData?._id
            );

            setAppointments(patientAppointments);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        router.push('/auth/login');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-700';
            case 'scheduled': return 'bg-blue-100 text-blue-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const upcomingAppointments = appointments
        .filter(apt => apt.status === 'scheduled')
        .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
        .slice(0, 3);

    const recentMedicalHistory = patientData?.medicalHistory
        ?.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 3) || [];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
                <div className="px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600">
                                <Heart className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    Patient Portal
                                </h1>
                                <p className="text-xs text-gray-500">Your Health Dashboard</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold">
                                    {userInfo?.name?.charAt(0) || 'P'}
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-sm font-medium text-gray-900">{userInfo?.name || 'Patient'}</p>
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

            <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        {greeting}, <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {patientData?.name?.split(' ')[0] || 'Patient'}
                        </span>
                    </h1>
                    <p className="text-gray-600">Here's your health summary and upcoming appointments</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Age</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{patientData?.age || 'N/A'}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <User className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Gender</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1 capitalize">{patientData?.gender || 'N/A'}</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Heart className="h-5 w-5 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Appointments</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{appointments.length}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <Calendar className="h-5 w-5 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Upcoming</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {appointments.filter(a => a.status === 'scheduled').length}
                                </p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <Clock className="h-5 w-5 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Profile & Info */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-lg">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                                    <User className="h-8 w-8 text-purple-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{patientData?.name}</h2>
                                    <p className="text-sm text-gray-600">Patient ID: {patientData?._id?.slice(-6)}</p>
                                </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">{patientData?.contact || 'No contact'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">{userInfo?.email}</span>
                                </div>
                            </div>
                        </div>

                        {/* Health Info */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-lg">
                            <h3 className="font-semibold text-gray-900 mb-4">Health Information</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Blood Group</span>
                                    <span className="font-medium text-gray-900">{patientData?.bloodGroup || 'Not specified'}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Allergies</span>
                                    <span className="font-medium text-gray-900">{patientData?.allergies || 'None'}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-600">Medications</span>
                                    <span className="font-medium text-gray-900">{patientData?.medications || 'None'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Appointments & History */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Upcoming Appointments */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-900">Upcoming Appointments</h3>
                                <button
                                    onClick={() => router.push('/patient/appointments')}
                                    className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                                >
                                    View All <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>

                            {upcomingAppointments.length > 0 ? (
                                <div className="space-y-3">
                                    {upcomingAppointments.map((apt) => (
                                        <div key={apt._id} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-purple-200 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                                                    <Stethoscope className="h-6 w-6 text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">Dr. {apt.doctorId?.name}</p>
                                                    <p className="text-sm text-gray-600">{apt.doctorId?.specialization}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Calendar className="h-3 w-3 text-gray-400" />
                                                        <span className="text-xs text-gray-500">
                                                            {format(new Date(apt.date), 'MMM d, yyyy')} at {apt.time}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                                                {apt.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">No upcoming appointments</p>
                                    <button className="mt-3 text-purple-600 hover:text-purple-700 text-sm font-medium">
                                        Book an Appointment
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Medical History */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-lg">
                            <h3 className="font-semibold text-gray-900 mb-4">Recent Medical History</h3>

                            {recentMedicalHistory.length > 0 ? (
                                <div className="space-y-3">
                                    {recentMedicalHistory.map((record, index) => (
                                        <div key={index} className="p-4 rounded-lg bg-gray-50">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Activity className="h-4 w-4 text-purple-600" />
                                                <span className="font-medium text-gray-900">{record.type}</span>
                                                <span className="text-xs text-gray-500 ml-auto">
                                                    {format(new Date(record.timestamp), 'MMM d, yyyy')}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">{record.details}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">No medical history found</p>
                                </div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={() => router.push('/patient/appointments/new')}
                                className="bg-white rounded-xl border border-gray-100 p-4 hover:border-purple-200 hover:shadow-md transition-all text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Calendar className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Book Appointment</h4>
                                        <p className="text-sm text-gray-600">Schedule a new visit</p>
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => router.push('/patient/prescriptions')}
                                className="bg-white rounded-xl border border-gray-100 p-4 hover:border-purple-200 hover:shadow-md transition-all text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Pill className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Prescriptions</h4>
                                        <p className="text-sm text-gray-600">View your medications</p>
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => router.push('/patient/reports')}
                                className="bg-white rounded-xl border border-gray-100 p-4 hover:border-purple-200 hover:shadow-md transition-all text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <FileText className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Medical Reports</h4>
                                        <p className="text-sm text-gray-600">Download reports</p>
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => router.push('/patient/messages')}
                                className="bg-white rounded-xl border border-gray-100 p-4 hover:border-purple-200 hover:shadow-md transition-all text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                        <Mail className="h-5 w-5 text-yellow-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Messages</h4>
                                        <p className="text-sm text-gray-600">Contact your doctor</p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}