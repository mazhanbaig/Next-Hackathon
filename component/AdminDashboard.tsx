"use client";

import { useEffect, useState } from "react";
import api from "@/config/api";
import { message, Spin } from "antd";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

interface Patient {
    _id: string;
    name: string;
    age: number;
    gender: string;
    contact?: string;
}

export default function AdminDashboard() {
    const [doctors, setDoctors] = useState<User[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [receptionists, setReceptionists] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch all doctors
            const doctorsRes = await api.get("/api/users?role=doctor");
            setDoctors(doctorsRes.data.data);

            // Fetch all receptionists
            const receptionistsRes = await api.get("/api/users?role=receptionist");
            setReceptionists(receptionistsRes.data.data);

            // Fetch all patients
            const patientsRes = await api.get("/api/patients");
            setPatients(patientsRes.data.data);
        } catch (error: any) {
            console.log(error);
            message.error("Failed to fetch data");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

            {/* Doctors Section */}
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-3 text-gray-700">Doctors</h2>
                <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-lg shadow overflow-hidden">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Specialization</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map((d) => (
                                <tr key={d._id} className="border-b hover:bg-blue-50 transition">
                                    <td className="p-3">{d.name}</td>
                                    <td className="p-3">{d.email}</td>
                                    <td className="p-3">{d.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Receptionists Section */}
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-3 text-gray-700">Receptionists</h2>
                <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-lg shadow overflow-hidden">
                        <thead className="bg-green-100">
                            <tr>
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receptionists.map((r) => (
                                <tr key={r._id} className="border-b hover:bg-green-50 transition">
                                    <td className="p-3">{r.name}</td>
                                    <td className="p-3">{r.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Patients Section */}
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-3 text-gray-700">Patients</h2>
                <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-lg shadow overflow-hidden">
                        <thead className="bg-purple-100">
                            <tr>
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Age</th>
                                <th className="p-3 text-left">Gender</th>
                                <th className="p-3 text-left">Contact</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map((p) => (
                                <tr key={p._id} className="border-b hover:bg-purple-50 transition">
                                    <td className="p-3">{p.name}</td>
                                    <td className="p-3">{p.age}</td>
                                    <td className="p-3">{p.gender}</td>
                                    <td className="p-3">{p.contact || "N/A"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}