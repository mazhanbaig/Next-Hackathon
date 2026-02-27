"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      router.replace("/auth/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Welcome to your Dashboard</h1>
      <br />
      <br />
      <p className="text-gray-500 mt-2">You are logged in!</p>
    </div>
  );
}