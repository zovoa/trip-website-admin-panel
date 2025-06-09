import React from 'react';
import { Users, Building, Car, DollarSign, Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppSidebar from '@/components/ui/AppSidebar';
import Navbar from '@/components/ui/Navbar';
import MetricCard from '@/components/dashboard/MetricCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import PendingApprovals from '@/components/dashboard/PendingApprovals';

const Dashboard = () => {
  // Mock data for dashboard metrics
  const metrics = [
    {
      title: "Total Bookings",
      value: "1,247",
      subtitle: "Rooms + Vehicles",
      icon: Calendar,
      change: "+12.5%",
      changeType: "positive" as const,
      color: "bg-blue-500"
    },
    {
      title: "Total Users",
      value: "3,892",
      subtitle: "Active customers",
      icon: Users,
      change: "+8.2%",
      changeType: "positive" as const,
      color: "bg-green-500"
    },
    {
      title: "Properties/Vendors",
      value: "456",
      subtitle: "Hotels + Vehicle partners",
      icon: Building,
      change: "+5.1%",
      changeType: "positive" as const,
      color: "bg-purple-500"
    },
    {
      title: "Revenue (Commission)",
      value: "$78,932",
      subtitle: "This month",
      icon: DollarSign,
      change: "+15.3%",
      changeType: "positive" as const,
      color: "bg-amber-500"
    }
  ];

  const pendingApprovals = [
    { type: "Property", count: 12, color: "bg-blue-100 text-blue-800" },
    { type: "Vehicle", count: 8, color: "bg-green-100 text-green-800" },
    { type: "User KYC", count: 23, color: "bg-orange-100 text-orange-800" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col">
        <Navbar />
        
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your travel booking platform.</p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity - Takes 2 columns */}
            <div className="lg:col-span-2">
              <RecentActivity />
            </div>

            {/* Pending Approvals - Takes 1 column */}
            <div>
              <PendingApprovals approvals={pendingApprovals} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
