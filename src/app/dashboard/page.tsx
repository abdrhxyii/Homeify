'use client';
import { useState, useEffect } from "react";
import { Menu, Home, Clipboard, FileText, Calendar, Bell, Layers, Globe, Book, Users, LogOut, Crown, ChevronRight } from "lucide-react";
import SidebarItem from "@/components/admin/SidebarItem";
import Dashboard from "@/components/admin/Dashboard";
import PropertyListing from "@/components/admin/PropertyListing";
import SubscriptionPlans from "@/components/admin/Subscription";
import Membership from "@/components/admin/Membership";
import ChatUI from "@/components/admin/ChatUI";
import { Tooltip } from "antd";
import { useAuthStore } from "@/store/useAuthStore";
import ManageSubscriptions from "@/components/admin/ManageSubscription";

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState<string>("Dashboard");
  const [isButtonPulsing, setIsButtonPulsing] = useState(false);
  const { role } = useAuthStore();

  // Animation effect for the membership button
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setIsButtonPulsing(true);
      setTimeout(() => {
        setIsButtonPulsing(false);
      }, 1000);
    }, 5000);

    return () => clearInterval(pulseInterval);
  }, []);

  const renderContent = () => {
    switch (activeItem) {
      case "Home":
        return <Dashboard />;
      case "Property Listings":
        return <PropertyListing />;
      case "Subscription Lists":
        return <SubscriptionPlans />;
      case "Chat":
        return <ChatUI />;
      case "Membership":
        return <Membership />;
      case "Manage Subscriptions":
        return <ManageSubscriptions />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 pt-16">
      <div
        className={`bg-primary text-white transition-all duration-300 ease-in-out 
          ${isSidebarOpen ? "w-64 min-w-64 max-w-64" : "w-16 min-w-16 max-w-16"} 
          flex flex-col h-full relative overflow-hidden`}
      >
        <button
          className="p-4 focus:outline-none w-full"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="text-white" />
        </button>
        <nav className="flex flex-col space-y-4 flex-grow">
          <Tooltip title={isSidebarOpen ? "" : "Home"} placement="right">
            <div>
              <SidebarItem
                icon={<Home size={20} />}
                text="Home"
                isOpen={isSidebarOpen}
                onClick={() => setActiveItem("Home")}
                isActive={activeItem === "Home"}
              />
            </div>
          </Tooltip>
          <Tooltip title={isSidebarOpen ? "" : "Property Listings"} placement="right">
            <div>
              <SidebarItem
                icon={<Clipboard size={20} />}
                text="Property Listings"
                isOpen={isSidebarOpen}
                onClick={() => setActiveItem("Property Listings")}
                isActive={activeItem === "Property Listings"}
              />
            </div>
          </Tooltip>
          {role !== "ADMIN" && (
            <Tooltip title={isSidebarOpen ? "" : "Membership"} placement="right">
              <div>
                <SidebarItem
                  icon={<FileText size={20} />}
                  text="Membership"
                  isOpen={isSidebarOpen}
                  onClick={() => setActiveItem("Membership")}
                  isActive={activeItem === "Membership"}
                />
              </div>
            </Tooltip>
          )}
          <Tooltip title={isSidebarOpen ? "" : "Chat"} placement="right">
            <div>
              <SidebarItem
                icon={<FileText size={20} />}
                text="Chat"
                isOpen={isSidebarOpen}
                onClick={() => setActiveItem("Chat")}
                isActive={activeItem === "Chat"}
              />
            </div>
          </Tooltip>
          {role === "ADMIN" && (
            <Tooltip title={isSidebarOpen ? "" : "Manage Subscriptions"} placement="right">
              <div>
                <SidebarItem
                  icon={<Users size={20} />}
                  text="Manage Subscriptions"
                  isOpen={isSidebarOpen}
                  onClick={() => setActiveItem("Manage Subscriptions")}
                  isActive={activeItem === "Manage Subscriptions"}
                />
              </div>
            </Tooltip>
          )}
        </nav>

        {/* Membership Button at the bottom */}
        <div className="mt-auto mb-6 px-3 flex-shrink-0">
          <Tooltip title={isSidebarOpen ? "" : "Buy Membership"} placement="right">
            <button
              onClick={() => setActiveItem("Membership")}
              className={`
                relative w-full rounded-lg overflow-hidden 
                ${isSidebarOpen ? "py-3 px-4" : "p-2"} 
                transition-all duration-300 ease-in-out
                bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
                shadow-md hover:shadow-lg transform hover:-translate-y-1
                ${isButtonPulsing ? "animate-pulse" : ""}
              `}
            >
              <div className="absolute -right-3 -top-3 bg-yellow-400 rounded-full p-1 shadow-md animate-bounce">
                <Crown size={isSidebarOpen ? 16 : 14} className="text-indigo-800" />
              </div>

              <div className="flex items-center justify-center">
                {isSidebarOpen ? (
                  <div className="flex items-center">
                    <Crown size={20} className="mr-2 text-yellow-300" />
                    <span className="font-semibold">Buy Membership</span>
                    <ChevronRight size={16} className="ml-1 animate-pulse" />
                  </div>
                ) : (
                  <Crown size={20} className="text-yellow-300" />
                )}
              </div>
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <main className="p-5 flex-1 overflow-auto">{renderContent()}</main>
      </div>
    </div>
  );
}