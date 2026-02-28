'use client';

import React from "react";

interface ButtonProps {
    label: any;
    onClick?: (e?: any) => any;
    type?: "button" | "submit";
    variant?: "primary" | "secondary" | "danger" | "theme" | "theme2";
    size?: "sm" | "md" | "lg" | "xl";
    disabled?: boolean;
    classNameC?: string;
    icon?: React.ReactNode;   // ✅ Added icon support
}

export default function Button({
    label,
    onClick,
    type = "button",
    variant = "primary",
    size = "md",
    disabled = false,
    classNameC = "",
    icon,                     // ✅ Added here
}: ButtonProps) {
    const styles: Record<string, string> = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white",
        secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900",
        theme2: "bg-black hover:bg-gray-700 text-white",
        danger: "bg-red-600 hover:bg-red-700 text-white",
        theme: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white",
    };

    const sizes: Record<string, string> = {
        sm: "px-3 py-1 text-sm",
        md: "px-4 py-2 text-md",
        lg: "px-5 py-2.5 text-md",
        xl: "px-6 py-3 text-lg",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                rounded-xl text-center flex justify-center font-medium transition  gap-2
                ${styles[variant]}
                ${sizes[size]}
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                ${classNameC}
            `}
        >
            {icon && <span className="flex items-center">{icon}</span>}
            <span>{label}</span>
        </button>
    );
}
