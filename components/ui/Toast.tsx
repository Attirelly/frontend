// components/Toast.tsx
"use client";

import React, { useEffect, useState } from "react";

type ToastProps = {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
};

export default function Toast({ message, type = "success", onClose }: ToastProps) {
    const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
        setVisible(false);
      setTimeout(onClose, 300);
    }, 3000); // Hide after 3 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`rounded-2xl fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 shadow-lg text-white 
        ${type === 'success' ? 'bg-green-600' : 'bg-red-600'} 
        transition-opacity duration-300 ease-in-out 
        ${visible ? 'opacity-100' : 'opacity-0'}
      `}
    >
      {message}
    </div>
  );
}
