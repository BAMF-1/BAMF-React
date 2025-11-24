"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import AccountSettings from "@/components/Profile/AccountSettings";
import DangerZone from "@/components/Profile/DangerZone";
import OrderHistory from "@/components/Profile/OrderHistory";
import { userService } from "@/services/user.service";

const ProfilePage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [orderHistory, setOrderHistory] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Redirect based on authentication and role
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/");
      } else if (user.role === "Admin") {
        router.push("/admin");
      } else {
        setEmail(user.email);
        console.log("Profile page, user email:", user.email);
      }
    }
  }, [user, isLoading, router]);

  // Fetch order history
  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (user && user.role !== "Admin") {
        setOrdersLoading(true);
        console.log("profile, email:", email);
        const response = await userService.getOrderHistory(email);
        if (response.data) {
          setOrderHistory(response.data);
        } else {
          console.error("Failed to fetch order history:", response.error);
          setOrderHistory([]);
        }
        setOrdersLoading(false);
        console.log("Order history updated:", response.data);
      }
    };

    fetchOrderHistory();
  }, [email,user]);

  // Show a loading state or redirecting state
  if (isLoading || !user || user.role === "Admin") {
    return <div className="min-h-screen bg-[#1a1a1a]" />;
  }

  return (
    <div className="min-h-screen bg-[#171010] text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <ProfileHeader />
        <AccountSettings email={email} setEmail={setEmail} />
        <DangerZone />
        <OrderHistory orders={orderHistory} isLoading={ordersLoading} />
      </div>
    </div>
  );
};

export default ProfilePage;
