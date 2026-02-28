"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/component/Button";
import { logoutUser } from "@/config/dbfunctions";
import DocterDashboard from "@/component/DocterDashboard";
import AdminDashboard from "@/component/AdminDashboard";
import ReceptionistDashboard from "@/component/ReceptionistDashboard";
import PatientDashboard from "@/component/PatientDashboard";

// Dummy components for demonstration
const AdminComponent = () => <div className="p-6 bg-white rounded shadow">Admin Dashboard Content</div>;
const DoctorComponent = () => <div className="p-6 bg-white rounded shadow">Doctor Dashboard Content</div>;
const ReceptionistComponent = () => <div className="p-6 bg-white rounded shadow">Receptionist Dashboard Content</div>;
const PatientComponent = () => <div className="p-6 bg-white rounded shadow">Patient Dashboard Content</div>;

export default function Home() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (!storedUser) {
      router.replace("/auth/login");
      return;
    }
    setUserInfo(JSON.parse(storedUser));
  }, [router]);

  if (!userInfo) return null; 
  
  const renderRoleComponent = () => {
    switch (userInfo.role) {
      case "admin":
        return <AdminDashboard />;
      case "doctor":
        return <DocterDashboard />;
      case "receptionist":
        return <ReceptionistDashboard />;
      case "patient":
        return <PatientDashboard />;
      default:
        return <p>Role not recognized</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Welcome, {userInfo.name}</h1>
        <Button label="Logout" onClick={logoutUser} />
      </div>

      {/* Role-based content */}
      {renderRoleComponent()}
    </div>
  );
}