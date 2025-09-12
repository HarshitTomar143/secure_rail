"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md border border-blue-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">SecureRails</h1>
          <p className="text-blue-600">Select your dashboard</p>
        </div>

        <div className="space-y-6">
          
          <Link href="/vendor">
            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-medium">
              Vendor Dashboard
            </button>
          </Link>

          <div className="text-center text-gray-500">or</div>

          <Link href="/admin" className="mb-4">
            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-medium">
              Admin Dashboard
            </button>
          </Link>
          
        </div>
      </div>
    </div>
  );
}