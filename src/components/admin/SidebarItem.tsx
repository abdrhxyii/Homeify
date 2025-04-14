'use client';
import { useState, useEffect } from "react";
import { Menu, Home, Clipboard, FileText, Calendar, Bell, Layers, Globe, Book, Users, LogOut, Crown, ChevronRight } from "lucide-react";
import { Tooltip } from "antd";
import Dashboard from "@/components/admin/Dashboard";
import PropertyListing from "@/components/admin/PropertyListing";
import SubscriptionPlans from "@/components/admin/Subscription";
import Membership from "@/components/admin/Membership";
import ChatUI from "@/components/admin/ChatUI";

// SidebarItem component
interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  isOpen: boolean;
  onClick: () => void;
  isActive: boolean;
}

export default function SidebarItem({ icon, text, isOpen, onClick, isActive }: SidebarItemProps) {
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