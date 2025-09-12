"use client";
import Link from "next/link";

export default function ManageQR() {
  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-900">Manage QR Codes</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/vendor">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200">
                  Back to Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Three Main Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Generate QR Card */}
            <div className="bg-white shadow-sm rounded-lg border border-blue-100 hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg font-bold">+</span>
                  </div>
                  <h3 className="text-xl font-semibold text-blue-900 ml-4">Generate QR</h3>
                </div>
                <p className="text-blue-600">Create new QR codes for your products and shipments</p>
                <div className="mt-4">
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200">
                    Create QR Code
                  </button>
                </div>
              </div>
            </div>

            {/* Manage QR Codes Card */}
            <div className="bg-white shadow-sm rounded-lg border border-blue-100 hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg font-bold">📋</span>
                  </div>
                  <h3 className="text-xl font-semibold text-blue-900 ml-4">Manage QR Codes</h3>
                </div>
                <p className="text-blue-600">View and manage your existing QR codes</p>
                <div className="mt-4">
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200">
                    View All QR Codes
                  </button>
                </div>
              </div>
            </div>

            {/* QR Analytics Card */}
            <div className="bg-white shadow-sm rounded-lg border border-blue-100 hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg font-bold">📊</span>
                  </div>
                  <h3 className="text-xl font-semibold text-blue-900 ml-4">QR Analytics</h3>
                </div>
                <p className="text-blue-600">Track QR code scans and performance metrics</p>
                <div className="mt-4">
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200">
                    View Analytics
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}