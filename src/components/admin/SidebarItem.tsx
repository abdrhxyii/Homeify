'use client';
import React from 'react';

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  isOpen: boolean;
  onClick: () => void;
  isActive: boolean;
}

export default function SidebarItem({
  icon,
  text,
  isOpen,
  onClick,
  isActive,
}: SidebarItemProps) {
  return (
    <div
      className={`flex items-center space-x-3 py-[6px] px-[15px] hover:bg-gray-700 rounded cursor-pointer transition-colors ${
        isActive ? "bg-gray-700" : ""
      }`}
      onClick={onClick}
    >
      {icon}
      {isOpen && <span className="text-white text-md">{text}</span>}
    </div>
  );
}