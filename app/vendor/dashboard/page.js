"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function VendorDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    earnings: 0
  });

  useEffect(() => {
    checkUser();
    fetchStats();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      window.location.href = "/";
      return;
    }

    // Verify vendor role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, full_name, company_name")
      .eq("id", session.user.id)
      .single();

    if (profile?.role !== "vendor") {
      window.location.href = "/";
      return;
    }

    setUser({ ...session.user, profile });
    setLoading(false);
  };

  const fetchStats = async () => {
    // Mock data - replace with actual database queries based on vendor ID
    setStats({
      totalOrders: 42,
      pendingOrders: 8,
      completedOrders: 34,
      earnings: 85600
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-blue-600">Loading...</div>
      </div>
    );
  }

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
              <span className="text-blue-800">
                {user?.profile?.company_name || user?.profile?.full_name || user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
              >
                Sign Out
              </button>
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
                      <span className="text-white text-sm font-bold">T</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-blue-900">Total Orders</h3>
                    <p className="text-3xl font-bold text-blue-600">{stats.totalOrders}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-blue-100">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">P</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-blue-900">Pending Orders</h3>
                    <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-blue-100">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">C</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-blue-900">Completed</h3>
                    <p className="text-3xl font-bold text-green-600">{stats.completedOrders}</p>
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
                    <h3 className="text-lg font-medium text-blue-900">Total Earnings</h3>
                    <p className="text-3xl font-bold text-blue-600">${stats.earnings.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Management */}
            <div className="bg-white shadow-sm rounded-lg border border-blue-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-blue-900 mb-4">Order Management</h2>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition duration-200">
                    <div className="font-medium text-blue-900">View All Orders</div>
                    <div className="text-sm text-blue-600">Manage your current and past orders</div>
                  </button>
                  <button className="w-full text-left p-3 bg-yellow-50 hover:bg-yellow-100 rounded-md transition duration-200">
                    <div className="font-medium text-yellow-900">Pending Orders</div>
                    <div className="text-sm text-yellow-600">8 orders require your attention</div>
                  </button>
                  <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition duration-200">
                    <div className="font-medium text-blue-900">Order History</div>
                    <div className="text-sm text-blue-600">View completed order details</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Business Tools */}
            <div className="bg-white shadow-sm rounded-lg border border-blue-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-blue-900 mb-4">Business Tools</h2>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition duration-200">
                    <div className="font-medium text-blue-900">Product Catalog</div>
                    <div className="text-sm text-blue-600">Manage your railway products and services</div>
                  </button>
                  <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition duration-200">
                    <div className="font-medium text-blue-900">Pricing & Quotes</div>
                    <div className="text-sm text-blue-600">Update pricing and generate quotes</div>
                  </button>
                  <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition duration-200">
                    <div className="font-medium text-blue-900">Performance Reports</div>
                    <div className="text-sm text-blue-600">View your business performance metrics</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="mt-8">
            <div className="bg-white shadow-sm rounded-lg border border-blue-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-blue-900 mb-4">Recent Orders</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-blue-200">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-blue-100">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">
                          #ORD-2024-001
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                          Railway Safety Equipment
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                          $12,500
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                          2024-09-10
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">
                          #ORD-2024-002
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                          Track Maintenance Tools
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Completed
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                          $8,750
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                          2024-09-08
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">
                          #ORD-2024-003
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                          Signal System Components
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            In Progress
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                          $25,000
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                          2024-09-05
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Company Profile */}
          <div className="mt-8">
            <div className="bg-white shadow-sm rounded-lg border border-blue-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-blue-900 mb-4">Company Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">Company Name</label>
                    <p className="text-blue-600">{user?.profile?.company_name || "Railway Solutions Inc."}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">Contact Email</label>
                    <p className="text-blue-600">{user?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">Vendor ID</label>
                    <p className="text-blue-600">VENDOR-{user?.id?.slice(0, 8).toUpperCase()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">Member Since</label>
                    <p className="text-blue-600">January 2024</p>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200">
                    Edit Profile
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