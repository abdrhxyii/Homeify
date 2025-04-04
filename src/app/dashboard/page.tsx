'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Home, Clipboard, FileText, Calendar, Bell, Layers, Globe, Book, Users, LogOut } from "lucide-react";
import { Popconfirm, message } from "antd";
import { destroyCookie } from "nookies";
import SidebarItem from "@/components/admin/SidebarItem";
import Dashboard from "@/components/admin/Dashboard";
import PropertyListing from "@/components/admin/PropertyListing";
import SubscriptionPlans from "@/components/admin/Subscription";
import Membership from "@/components/admin/Membership";
import ChatUI from "@/components/admin/ChatUI";

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState<string>("Dashboard");
  const router = useRouter();

  // useEffect(() => {
  //   const { token } = parseCookies();
  //   if (!token) {
  //     router.push("/");
  //   }
  // }, [router]);

  const handleLogout = () => {
    destroyCookie(null, "token");
    message.success("Logged out successfully!");
    router.push("/");
  };

  const renderContent = () => {
    switch (activeItem) {
      case "Home":
        return <Dashboard/>
      case "Property Listings":
        return <PropertyListing/>
      case "Subscription Lists":
        return <SubscriptionPlans/>
      case "Chat":
        return <ChatUI/>
      case "Membership":
          return <Membership/>
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div
        className={`bg-gray-900 text-white transition-all duration-300 ease-in-out 
          ${isSidebarOpen ? "w-64" : "w-16"} flex flex-col`}
      >
        <button
          className="p-4 focus:outline-none"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="text-white" />
        </button>
        <nav className="flex flex-col space-y-4 mt-4">
          <SidebarItem
            icon={<Home size={20} />}
            text="Home"
            isOpen={isSidebarOpen}
            onClick={() => setActiveItem("Home")}
            isActive={activeItem === "Home"}
          />
          <SidebarItem
            icon={<Clipboard size={20} />}
            text="Property Listings"
            isOpen={isSidebarOpen}
            onClick={() => setActiveItem("Property Listings")}
            isActive={activeItem === "Property Listings"}
          />
          {/* <SidebarItem
            icon={<FileText size={20} />}
            text="Subscription Lists"
            isOpen={isSidebarOpen}
            onClick={() => setActiveItem("Subscription Lists")}
            isActive={activeItem === "Subscription Lists"}
          /> */}
          <SidebarItem
            icon={<FileText size={20} />}
            text="Membership"
            isOpen={isSidebarOpen}
            onClick={() => setActiveItem("Membership")}
            isActive={activeItem === "Membership"}
          />
          <SidebarItem
            icon={<FileText size={20} />}
            text="Chat"
            isOpen={isSidebarOpen}
            onClick={() => setActiveItem("Chat")}
            isActive={activeItem === "Chat"}
          />
        </nav>
      </div>

      <div className="flex-1 flex flex-col">
        <header className="bg-white text-black shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Welcome to dashboard 👋</h1>

          <Popconfirm
            title="Are you sure you want to logout?"
            onConfirm={handleLogout}
            okText="Yes"
            cancelText="No"
          >
            <button className="text-gray-600 hover:text-red-600 flex items-center space-x-2">
              <LogOut size={20} />
            </button>
          </Popconfirm>
        </header>

        <main className="p-3 flex-1">{renderContent()}</main>
      </div>
    </div>
  );
}