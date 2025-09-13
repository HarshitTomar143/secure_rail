"use client";
import { useState } from "react";
import Link from "next/link";

export default function VendorDashboard() {
  const [stats] = useState({
    totalOrders: 42,
    pendingOrders: 8,
    completedOrders: 34,
    earnings: 85600
  });

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-900">SecureRails Vendor Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-blue-800">Welcome, Railway Solutions Inc.</span>
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
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Main Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Manage QR Card */}
            <Link href="/vendor/manage-qr">
              <div className="bg-white shadow-sm rounded-lg border border-blue-100 hover:shadow-md transition-shadow duration-200 cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg font-bold">QR</span>
                    </div>
                    <h3 className="text-xl font-semibold text-blue-900 ml-4">Manage QR</h3>
                  </div>
                  <p className="text-blue-600">Generate and manage QR codes for your products and shipments</p>
                </div>
              </div>
            </Link>

            {/* Inventory Card */}
            <Link href="/vendor/inventory">
              <div className="bg-white shadow-sm rounded-lg border border-blue-100 hover:shadow-md transition-shadow duration-200 cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg font-bold">📦</span>
                    </div>
                    <h3 className="text-xl font-semibold text-blue-900 ml-4">Inventory</h3>
                  </div>
                  <p className="text-blue-600">Track and manage your product inventory and stock levels</p>
                </div>
              </div>
            </Link>

            {/* Shipments Card */}
            <Link href="/vendor/shipments">
              <div className="bg-white shadow-sm rounded-lg border border-blue-100 hover:shadow-md transition-shadow duration-200 cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg font-bold">🚚</span>
                    </div>
                    <h3 className="text-xl font-semibold text-blue-900 ml-4">Shipments</h3>
                  </div>
                  <p className="text-blue-600">Monitor and manage your shipment deliveries and tracking</p>
                </div>
              </div>
            </Link>
          </div>
          </div>

          {/* Quick Actions */}
          

          {/* Recent Orders */}
          

          {/* Company Profile */}
          
        </div>
      </div>
    
  );
}