'use client';

import { message } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    ArrowLeft, Stethoscope, Calendar, Users,
    Mail, Phone, Clock, Edit, Trash2,
    Heart, Activity, User, MapPin, FileText
} from "lucide-react";
import api from "@/config/api";

export default function DoctorDetailsPage({ params }:any) {
    const [loading, setLoading] = useState<any>(true);
    const [doctor, setDoctor] = useState<any>(null);
    const [userInfo, setUserInfo] = useState<any>(null);
    const router = useRouter();
    const { id } = params;

    // Check authentication
    useEffect(() => {
        const checkAuth = () => {
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
        };

        checkAuth();
    }, [router]);

    // Fetch doctor details
    useEffect(() => {
        if (userInfo && id) {
            fetchDoctorDetails();
        }
    }, [userInfo, id]);

    const fetchDoctorDetails = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/api/doctor/${id}`);
            console.log('Doctor details:', response.data);

            if (response.data && response.data.success) {
                setDoctor(response.data.data);
            } else {
                message.error('Doctor not found');
                router.push('/admin');
            }
        } catch (error) {
            console.error('Error fetching doctor:', error);
            message.error('Failed to fetch doctor details');
            router.push('/admin');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this doctor?')) return;

        try {
            const response = await api.delete(`/api/doctor/${id}`);
            if (response.data && response.data.success) {
                message.success('Doctor deleted successfully');
                router.push('/admin');
            }
        } catch (error) {
            console.error('Error deleting doctor:', error);
            message.error('Failed to delete doctor');
        }
    };

    const handleEdit = () => {
        router.push(`/admin/doctors/edit/${id}`);
    };

    const handleBack = () => {
        router.push('/admin');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-white via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading doctor details...</p>
                </div>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-white via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Doctor not found</p>
                    <button
                        onClick={handleBack}
                        className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-white to-purple-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
                <div className="px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleBack}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5 text-gray-600" />
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600">
                                    <Stethoscope className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                        Doctor Profile
                                    </h1>
                                    <p className="text-xs text-gray-500">View doctor details</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleEdit}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Edit className="h-4 w-4" />
                                <span>Edit</span>
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                                <span>Delete</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="p-4 sm:p-6 lg:p-8">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg mb-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                            <Stethoscope className="h-12 w-12 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{doctor.name}</h1>
                            <div className="flex flex-wrap gap-3">
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                    {doctor.specialization}
                                </span>
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                    Active
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Member since</p>
                            <p className="font-medium text-gray-900">
                                {new Date(doctor.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Personal Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* About */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-lg">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
                            <p className="text-gray-600 leading-relaxed">
                                {doctor.bio || 'No bio available'}
                            </p>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-lg">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium text-gray-900">
                                            {doctor.userId?.email || 'Not provided'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <p className="font-medium text-gray-900">
                                            {doctor.contact || 'Not provided'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Patients List */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Assigned Patients</h2>
                                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                                    {doctor.patients?.length || 0} Patients
                                </span>
                            </div>

                            {doctor.patients && doctor.patients.length > 0 ? (
                                <div className="space-y-3">
                                    {doctor.patients.slice(0, 5).map((patient) => (
                                        <div
                                            key={patient._id}
                                            className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-purple-200 transition-all cursor-pointer"
                                            onClick={() => router.push(`/admin/patients/${patient._id}`)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                                    <Users className="h-4 w-4 text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{patient.name}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {patient.age} years • {patient.gender}
                                                    </p>
                                                </div>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-gray-400" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 py-4">No patients assigned</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Stats & Info */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-lg">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-blue-500" />
                                        <span className="text-gray-600">Total Appointments</span>
                                    </div>
                                    <span className="font-semibold text-gray-900">0</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-5 w-5 text-purple-500" />
                                        <span className="text-gray-600">Total Patients</span>
                                    </div>
                                    <span className="font-semibold text-gray-900">
                                        {doctor.patients?.length || 0}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-green-500" />
                                        <span className="text-gray-600">Experience</span>
                                    </div>
                                    <span className="font-semibold text-gray-900">{doctor.experience || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Working Hours */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-lg">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Working Hours</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Monday - Friday</span>
                                    <span className="font-medium text-gray-900">9:00 AM - 6:00 PM</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Saturday</span>
                                    <span className="font-medium text-gray-900">10:00 AM - 4:00 PM</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Sunday</span>
                                    <span className="font-medium text-gray-900">Closed</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-lg">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                            <div className="space-y-3">
                                <button
                                    onClick={() => router.push(`/admin/appointments/new?doctor=${id}`)}
                                    className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all"
                                >
                                    <span className="font-medium text-gray-700">Schedule Appointment</span>
                                    <Calendar className="h-4 w-4 text-purple-600" />
                                </button>
                                <button
                                    onClick={() => router.push(`/admin/messages/new?doctor=${id}`)}
                                    className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all"
                                >
                                    <span className="font-medium text-gray-700">Send Message</span>
                                    <Mail className="h-4 w-4 text-purple-600" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}