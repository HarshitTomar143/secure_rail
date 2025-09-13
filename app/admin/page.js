"use client";
import { useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats] = useState({
    totalVendors: 15,
    totalUsers: 247,
    activeOrders: 32,
    revenue: 124500
  });

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-900">SecureRails Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-blue-800">Welcome, Admin</span>
              <Link href="/">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200">
                  Back to Home
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-blue-100">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">V</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-blue-900">Total Vendors</h3>
                    <p className="text-3xl font-bold text-blue-600">{stats.totalVendors}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-blue-100">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">U</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-blue-900">Total Users</h3>
                    <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-blue-100">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">O</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-blue-900">Active Orders</h3>
                    <p className="text-3xl font-bold text-blue-600">{stats.activeOrders}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-blue-100">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">$</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-blue-900">Revenue</h3>
                    <p className="text-3xl font-bold text-blue-600">${stats.revenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Management */}
            <div className="bg-white shadow-sm rounded-lg border border-blue-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-blue-900 mb-4">User Management</h2>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition duration-200">
                    <div className="font-medium text-blue-900">Manage Vendors</div>
                    <div className="text-sm text-blue-600">View and manage vendor accounts</div>
                  </button>
                  <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition duration-200">
                    <div className="font-medium text-blue-900">User Permissions</div>
                    <div className="text-sm text-blue-600">Configure user roles and permissions</div>
                  </button>
                  <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition duration-200">
                    <div className="font-medium text-blue-900">Account Verification</div>
                    <div className="text-sm text-blue-600">Review pending account verifications</div>
                  </button>
                </div>
              </div>
            </div>

            {/* System Management */}
            <div className="bg-white shadow-sm rounded-lg border border-blue-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-blue-900 mb-4">System Management</h2>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition duration-200">
                    <div className="font-medium text-blue-900">Railway Operations</div>
                    <div className="text-sm text-blue-600">Monitor and manage railway systems</div>
                  </button>
                  <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition duration-200">
                    <div className="font-medium text-blue-900">Security Settings</div>
                    <div className="text-sm text-blue-600">Configure system security parameters</div>
                  </button>
                  <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition duration-200">
                    <div className="font-medium text-blue-900">Reports & Analytics</div>
                    <div className="text-sm text-blue-600">Generate system reports and analytics</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <div className="bg-white shadow-sm rounded-lg border border-blue-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-blue-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
                    <div>
                      <div className="font-medium text-blue-900">New vendor registration</div>
                      <div className="text-sm text-blue-600">ABC Railway Solutions - Pending approval</div>
                    </div>
                    <div className="text-sm text-blue-500">2 hours ago</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
                    <div>
                      <div className="font-medium text-blue-900">System maintenance completed</div>
                      <div className="text-sm text-blue-600">Security updates successfully applied</div>
                    </div>
                    <div className="text-sm text-blue-500">1 day ago</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
                    <div>
                      <div className="font-medium text-blue-900">Order processed</div>
                      <div className="text-sm text-blue-600">Railway safety equipment - Order #1234</div>
                    </div>
                    <div className="text-sm text-blue-500">2 days ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}