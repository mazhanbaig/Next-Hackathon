// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { message } from 'antd';
// import {
//     ArrowLeft, Stethoscope, Calendar, Users,
//     Mail, Phone, Clock, Edit, Trash2, ChevronRight
// } from 'lucide-react';
// import api from '@/config/api';

// interface PageProps {
//     params: { id: string };
// }

// export default function DoctorDetailsPage({ params }: PageProps) {
//     const { id } = params;
//     const router = useRouter();

//     const [loading, setLoading] = useState(true);
//     const [doctor, setDoctor] = useState<any>(null);
//     const [userInfo, setUserInfo] = useState<any>(null);

//     // Check auth and role
//     useEffect(() => {
//         const userStr = localStorage.getItem('userInfo');
//         if (!userStr) {
//             message.error('Please login first');
//             router.push('/auth/login');
//             return;
//         }

//         const user = JSON.parse(userStr);
//         if (user.role !== 'doctor') {
//             message.error('Access denied. Doctor only.');
//             router.push('/auth/login');
//             return;
//         }

//         setUserInfo(user);
//     }, [router]);

//     // Fetch doctor data
//     useEffect(() => {
//         if (userInfo && id) {
//             fetchDoctorDetails();
//         }
//     }, [userInfo, id]);

//     const fetchDoctorDetails = async () => {
//         setLoading(true);
//         try {
//             const res = await api.get(`/api/doctor/${id}`);
//             if (res.data?.success) {
//                 setDoctor(res.data.data);
//             } else {
//                 message.error('Doctor not found');
//                 router.push('/doctor/dashboard');
//             }
//         } catch (err) {
//             console.error(err);
//             message.error('Failed to fetch doctor details');
//             router.push('/doctor/dashboard');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Patient actions
//     const handleAddPatient = () => {
//         router.push(`/doctor/patients/new?doctor=${id}`);
//     };

//     const handleEditPatient = (patientId: string) => {
//         router.push(`/doctor/patients/edit/${patientId}`);
//     };

//     const handleDeletePatient = async (patientId: string) => {
//         if (!window.confirm('Are you sure you want to delete this patient?')) return;

//         try {
//             const res = await api.delete(`/api/patient/${patientId}`);
//             if (res.data?.success) {
//                 message.success('Patient deleted');
//                 fetchDoctorDetails(); // Refresh list
//             }
//         } catch (err) {
//             console.error(err);
//             message.error('Failed to delete patient');
//         }
//     };

//     const handleBack = () => {
//         router.push('/doctor/dashboard');
//     };

//     if (loading) return (
//         <div className="min-h-screen flex items-center justify-center">
//             <div className="text-center">
//                 <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
//                 <p>Loading doctor details...</p>
//             </div>
//         </div>
//     );

//     if (!doctor) return (
//         <div className="min-h-screen flex items-center justify-center">
//             <div className="text-center">
//                 <p>Doctor not found</p>
//                 <button
//                     onClick={handleBack}
//                     className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
//                 >
//                     Go Back
//                 </button>
//             </div>
//         </div>
//     );

//     return (
//         <div className="min-h-screen bg-purple-50 p-4 sm:p-6 lg:p-8">
//             {/* Header */}
//             <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 p-4 flex justify-between items-center">
//                 <div className="flex items-center gap-4">
//                     <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-lg">
//                         <ArrowLeft className="h-5 w-5 text-gray-600" />
//                     </button>
//                     <h1 className="text-xl font-bold text-purple-700">Doctor Dashboard</h1>
//                 </div>
//             </header>

//             {/* Doctor Info */}
//             <div className="bg-white rounded-2xl p-6 shadow-lg mt-6 flex flex-col md:flex-row items-center md:items-start gap-6">
//                 <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
//                     <Stethoscope className="h-12 w-12 text-blue-600" />
//                 </div>
//                 <div className="flex-1">
//                     <h1 className="text-3xl font-bold text-gray-900 mb-2">{doctor.name}</h1>
//                     <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">{doctor.specialization}</span>
//                 </div>
//                 <div className="text-right">
//                     <p className="text-sm text-gray-500">Member since</p>
//                     <p className="font-medium text-gray-900">{new Date(doctor.createdAt).toLocaleDateString()}</p>
//                 </div>
//             </div>

//             {/* Patients Section */}
//             <div className="bg-white rounded-xl p-6 shadow-lg mt-6">
//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-lg font-semibold text-gray-900">Assigned Patients</h2>
//                     <button
//                         onClick={handleAddPatient}
//                         className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//                     >
//                         Add Patient
//                     </button>
//                 </div>

//                 {doctor.patients?.length ? (
//                     <div className="space-y-3">
//                         {doctor.patients.map((patient: any) => (
//                             <div
//                                 key={patient._id}
//                                 className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-purple-200 transition-all"
//                             >
//                                 <div className="flex items-center gap-3">
//                                     <Users className="h-5 w-5 text-purple-600" />
//                                     <div>
//                                         <p className="font-medium text-gray-900">{patient.name}</p>
//                                         <p className="text-xs text-gray-500">{patient.age} years • {patient.gender}</p>
//                                     </div>
//                                 </div>
//                                 <div className="flex gap-2">
//                                     <button onClick={() => handleEditPatient(patient._id)} className="px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//                                         Edit
//                                     </button>
//                                     <button onClick={() => handleDeletePatient(patient._id)} className="px-2 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700">
//                                         Delete
//                                     </button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 ) : (
//                     <p className="text-center text-gray-500 py-4">No patients assigned</p>
//                 )}
//             </div>
//         </div>
//     );
// }


'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { message } from 'antd';
import { ArrowLeft, Users, Stethoscope, Edit, Trash2 } from 'lucide-react';
import api from '@/config/api';

export default function DoctorDetailsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id'); // doctor ID from URL

    const [loading, setLoading] = useState<any>(true);
    const [doctor, setDoctor] = useState<any>(null);

    useEffect(() => {
        if (id) fetchDoctor();
    }, [id]);

    const fetchDoctor = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/api/doctor/${id}`);
            if (res.data?.success) {
                setDoctor(res.data.data);
            } else {
                message.error('Doctor not found');
                router.push('/doctor/dashboard');
            }
        } catch (err) {
            console.error(err);
            message.error('Failed to fetch doctor');
            router.push('/doctor/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const deletePatient = async (patientId:any) => {
        if (!window.confirm('Are you sure you want to delete this patient?')) return;
        try {
            const res = await api.delete(`/api/patient/${patientId}`);
            if (res.data?.success) {
                message.success('Patient deleted');
                fetchDoctor();
            }
        } catch (err) {
            console.error(err);
            message.error('Failed to delete patient');
        }
    };

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Loading doctor data...</p>
            </div>
        );

    if (!doctor)
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <p className="text-gray-500">Doctor not found</p>
                <button
                    onClick={() => router.push('/doctor/dashboard')}
                    className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                    Back
                </button>
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <header className="flex justify-between items-center mb-6 bg-white p-4 rounded shadow">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/doctor/dashboard')}
                        className="p-2 hover:bg-gray-100 rounded"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Doctor Dashboard</h1>
                </div>
            </header>

            {/* Doctor Info */}
            <div className="bg-white p-6 rounded-2xl shadow mb-6 flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-24 h-24 flex items-center justify-center bg-blue-100 rounded-2xl">
                    <Stethoscope className="w-12 h-12 text-blue-600" />
                </div>
                <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-1">{doctor.name}</h2>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {doctor.specialization}
                    </span>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Member since</p>
                    <p className="font-medium text-gray-900">{new Date(doctor.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            {/* Patients Section */}
            <div className="bg-white p-6 rounded-xl shadow">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-600" />
                        Assigned Patients
                    </h2>
                    <button
                        onClick={() => router.push(`/doctor/patients/new?doctor=${id}`)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Add Patient
                    </button>
                </div>

                {doctor.patients?.length ? (
                    <div className="space-y-3">
                        {doctor.patients.map((patient:any) => (
                            <div
                                key={patient._id}
                                className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:border-purple-300 transition"
                            >
                                <div>
                                    <p className="font-medium text-gray-900">{patient.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {patient.age} yrs • {patient.gender}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => router.push(`/doctor/patients/edit/${patient._id}`)}
                                        className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        <Edit className="w-4 h-4 inline" />
                                    </button>
                                    <button
                                        onClick={() => deletePatient(patient._id)}
                                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                        <Trash2 className="w-4 h-4 inline" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-4">No patients assigned</p>
                )}
            </div>
        </div>
    );
}