'use client';

import { message } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    ArrowLeft, Stethoscope, Calendar, Users,
    Mail, Phone, Clock, Edit, Trash2,
    Heart, Activity, User, MapPin, FileText,
    ChevronRight, UserCircle, Droplets, Thermometer
} from "lucide-react";
import api from "@/config/api";

export default function PatientDetailsPage({ params }) {
    const [loading, setLoading] = useState(true);
    const [patient, setPatient] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
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

    // Fetch patient details
    useEffect(() => {
        if (userInfo && id) {
            fetchPatientDetails();
        }
    }, [userInfo, id]);

    const fetchPatientDetails = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/api/patient/${id}`);
            console.log('Patient details:', response.data);

            if (response.data && response.data.success) {
                setPatient(response.data.data);
            } else {
                message.error('Patient not found');
                router.push('/admin');
            }
        } catch (error) {
            console.error('Error fetching patient:', error);
            message.error('Failed to fetch patient details');
            router.push('/admin');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this patient?')) return;

        try {
            const response = await api.delete(`/api/patient/${id}`);
            if (response.data && response.data.success) {
                message.success('Patient deleted successfully');
                router.push('/admin');
            }
        } catch (error) {
            console.error('Error deleting patient:', error);
            message.error('Failed to delete patient');
        }
    };

    const handleEdit = () => {
        router.push(`/admin/patients/edit/${id}`);
    };

    const handleBack = () => {
        router.push('/admin');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-white via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading patient details...</p>
                </div>
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-white via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Patient not found</p>
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
                                    <Users className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                        Patient Profile
                                    </h1>
                                    <p className="text-xs text-gray-500">View patient details</p>
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
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
                            <UserCircle className="h-16 w-16 text-purple-600" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{patient.name}</h1>
                            <div className="flex flex-wrap gap-3">
                                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                                    {patient.age} years
                                </span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${patient.gender?.toLowerCase() === 'male'
                                        ? 'bg-blue-100 text-blue-800'
                                        : patient.gender?.toLowerCase() === 'female'
                                            ? 'bg-pink-100 text-pink-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {patient.gender}
                                </span>
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                    Active Patient
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Registered on</p>
                            <p className="font-medium text-gray-900">
                                {new Date(patient.createdAt || Date.now()).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Personal Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-lg">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <User className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Full Name</p>
                                        <p className="font-medium text-gray-900">{patient.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Age</p>
                                        <p className="font-medium text-gray-900">{patient.age} years</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Heart className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Gender</p>
                                        <p className="font-medium text-gray-900">{patient.gender}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Contact</p>
                                        <p className="font-medium text-gray-900">{patient.contact || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Medical History */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-lg">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Medical History</h2>
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Activity className="h-4 w-4 text-red-500" />
                                        <span className="font-medium text-gray-900">Conditions</span>
                                    </div>
                                    <p className="text-gray-600 text-sm">
                                        {patient.conditions || 'No recorded conditions'}
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Droplets className="h-4 w-4 text-blue-500" />
                                        <span className="font-medium text-gray-900">Allergies</span>
                                    </div>
                                    <p className="text-gray-600 text-sm">
                                        {patient.allergies || 'No known allergies'}
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileText className="h-4 w-4 text-green-500" />
                                        <span className="font-medium text-gray-900">Medications</span>
                                    </div>
                                    <p className="text-gray-600 text-sm">
                                        {patient.medications || 'No current medications'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Appointments History */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Recent Appointments</h2>
                                <button
                                    onClick={() => router.push(`/admin/appointments?patient=${id}`)}
                                    className="text-sm text-purple-600 hover:text-purple-700"
                                >
                                    View All
                                </button>
                            </div>

                            {patient.appointments && patient.appointments.length > 0 ? (
                                <div className="space-y-3">
                                    {patient.appointments.slice(0, 3).map((appointment) => (
                                        <div
                                            key={appointment._id}
                                            className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-purple-200 transition-all cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                                    <Calendar className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{appointment.date}</p>
                                                    <p className="text-xs text-gray-500">
                                                        Dr. {appointment.doctor?.name || 'Unknown'} • {appointment.time}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${appointment.status === 'completed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : appointment.status === 'scheduled'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {appointment.status || 'Scheduled'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 py-4">No appointments found</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Additional Info */}
                    <div className="space-y-6">
                        {/* Emergency Contact */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-lg">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h2>
                            <div className="space-y-3">
                                <div className="p-3 bg-red-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p className="font-medium text-gray-900">{patient.emergencyName || 'Not provided'}</p>
                                </div>
                                <div className="p-3 bg-red-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Relationship</p>
                                    <p className="font-medium text-gray-900">{patient.emergencyRelation || 'Not provided'}</p>
                                </div>
                                <div className="p-3 bg-red-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="font-medium text-gray-900">{patient.emergencyPhone || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Insurance Information */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-lg">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Insurance Info</h2>
                            <div className="space-y-3">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Provider</p>
                                    <p className="font-medium text-gray-900">{patient.insuranceProvider || 'Not provided'}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Policy Number</p>
                                    <p className="font-medium text-gray-900">{patient.policyNumber || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-lg">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Health Stats</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Heart className="h-5 w-5 text-red-500" />
                                        <span className="text-gray-600">Blood Group</span>
                                    </div>
                                    <span className="font-semibold text-gray-900">{patient.bloodGroup || 'N/A'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Activity className="h-5 w-5 text-green-500" />
                                        <span className="text-gray-600">Height</span>
                                    </div>
                                    <span className="font-semibold text-gray-900">{patient.height || 'N/A'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Thermometer className="h-5 w-5 text-orange-500" />
                                        <span className="text-gray-600">Weight</span>
                                    </div>
                                    <span className="font-semibold text-gray-900">{patient.weight || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-lg">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                            <div className="space-y-3">
                                <button
                                    onClick={() => router.push(`/admin/appointments/new?patient=${id}`)}
                                    className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all"
                                >
                                    <span className="font-medium text-gray-700">Schedule Appointment</span>
                                    <Calendar className="h-4 w-4 text-purple-600" />
                                </button>
                                <button
                                    onClick={() => router.push(`/admin/prescriptions/new?patient=${id}`)}
                                    className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all"
                                >
                                    <span className="font-medium text-gray-700">Write Prescription</span>
                                    <FileText className="h-4 w-4 text-purple-600" />
                                </button>
                                <button
                                    onClick={() => router.push(`/admin/messages/new?patient=${id}`)}
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