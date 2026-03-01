'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { message } from 'antd';
import {
    ArrowLeft, UserCircle, Calendar, Heart, Activity,
    Droplets, FileText, Mail, Thermometer, Phone
} from 'lucide-react';
import api from '@/config/api';

export default function PatientDashboardPage({ params }:any) {
    const { id } = params;
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [patient, setPatient] = useState<any>(null);
    const [userInfo, setUserInfo] = useState<any>(null);

    // Authentication check
    useEffect(() => {
        const userStr = localStorage.getItem('userInfo');
        if (!userStr) {
            message.error('Please login first');
            router.push('/auth/login');
            return;
        }

        const user = JSON.parse(userStr);
        if (user.role !== 'patient' || user._id !== id) {
            message.error('Access denied.');
            router.push('/auth/login');
            return;
        }

        setUserInfo(user);
    }, [router, id]);

    // Fetch patient data
    useEffect(() => {
        if (userInfo) fetchPatient();
    }, [userInfo]);

    const fetchPatient = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/api/patient/${id}`);
            if (res.data?.success) setPatient(res.data.data);
            else {
                message.error('Patient data not found');
                router.push('/auth/login');
            }
        } catch (err) {
            console.error(err);
            message.error('Failed to fetch patient data');
            router.push('/auth/login');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => router.push('/patient/dashboard');

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p>Loading your dashboard...</p>
                </div>
            </div>
        );

    if (!patient)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p>Patient data not found</p>
                    <button
                        onClick={handleBack}
                        className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );

    return (
        <div className="min-h-screen bg-purple-50 p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 p-4 flex items-center gap-4">
                <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-lg">
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <h1 className="text-xl font-bold text-purple-700">My Dashboard</h1>
            </header>

            {/* Profile Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg mt-6 flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
                    <UserCircle className="h-16 w-16 text-purple-600" />
                </div>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{patient.name}</h1>
                    <div className="flex flex-wrap gap-3">
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">{patient.age} years</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${patient.gender?.toLowerCase() === 'male'
                                ? 'bg-blue-100 text-blue-800'
                                : patient.gender?.toLowerCase() === 'female'
                                    ? 'bg-pink-100 text-pink-800'
                                    : 'bg-gray-100 text-gray-800'
                            }`}>
                            {patient.gender}
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Active</span>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal Info */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-lg">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Info</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Phone className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Contact</p>
                                    <p className="font-medium text-gray-900">{patient.contact || 'Not provided'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Calendar className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Age</p>
                                    <p className="font-medium text-gray-900">{patient.age} years</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Medical History */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-lg space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900">Medical History</h2>

                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Activity className="h-4 w-4 text-red-500" />
                                <span className="font-medium text-gray-900">Conditions</span>
                            </div>
                            <p className="text-gray-600 text-sm">{patient.conditions || 'No recorded conditions'}</p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Droplets className="h-4 w-4 text-blue-500" />
                                <span className="font-medium text-gray-900">Allergies</span>
                            </div>
                            <p className="text-gray-600 text-sm">{patient.allergies || 'No known allergies'}</p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="h-4 w-4 text-green-500" />
                                <span className="font-medium text-gray-900">Medications</span>
                            </div>
                            <p className="text-gray-600 text-sm">{patient.medications || 'No current medications'}</p>
                        </div>
                    </div>

                    {/* Appointments */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-lg">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Appointments</h2>
                        {patient.appointments?.length > 0 ? (
                            <div className="space-y-3">
                                {patient.appointments.map((a:any) => (
                                    <div key={a._id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">{a.date}</span>
                                            <span className="text-xs text-gray-500">Dr. {a.doctor?.name || 'Unknown'} • {a.time}</span>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${a.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                a.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {a.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-4">No appointments found</p>
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Quick Stats */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-lg">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Health Stats</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Blood Group</span>
                                <span className="font-medium text-gray-900">{patient.bloodGroup || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Height</span>
                                <span className="font-medium text-gray-900">{patient.height || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Weight</span>
                                <span className="font-medium text-gray-900">{patient.weight || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-lg">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <button
                                onClick={() => router.push(`/patient/appointments/${id}`)}
                                className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all"
                            >
                                <span className="font-medium text-gray-700">My Appointments</span>
                                <Calendar className="h-4 w-4 text-purple-600" />
                            </button>
                            <button
                                onClick={() => router.push(`/patient/messages/${id}`)}
                                className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all"
                            >
                                <span className="font-medium text-gray-700">Messages</span>
                                <Mail className="h-4 w-4 text-purple-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}