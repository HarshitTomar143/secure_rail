"use client";
import { useState } from "react";
import Link from "next/link";

export default function Shipments() {
  const [shipmentStats] = useState({
    totalShipments: 89,
    inTransit: 12,
    delivered: 71,
    pending: 6
  });

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-900">Shipment Management</h1>
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
          {/* Shipment Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-blue-100">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">🚚</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-blue-900">Total Shipments</h3>
                    <p className="text-3xl font-bold text-blue-600">{shipmentStats.totalShipments}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-blue-100">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">🚛</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-blue-900">In Transit</h3>
                    <p className="text-3xl font-bold text-orange-600">{shipmentStats.inTransit}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-blue-100">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">✅</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-blue-900">Delivered</h3>
                    <p className="text-3xl font-bold text-green-600">{shipmentStats.delivered}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-blue-100">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">⏳</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-blue-900">Pending</h3>
                    <p className="text-3xl font-bold text-yellow-600">{shipmentStats.pending}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shipment Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Shipment Management */}
            <div className="bg-white shadow-sm rounded-lg border border-blue-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-blue-900 mb-4">Shipment Operations</h2>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition duration-200">
                    <div className="font-medium text-blue-900">Create New Shipment</div>
                    <div className="text-sm text-blue-600">Schedule a new product shipment</div>
                  </button>
                  <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition duration-200">
                    <div className="font-medium text-blue-900">Track Shipments</div>
                    <div className="text-sm text-blue-600">Monitor real-time shipment status</div>
                  </button>
                  <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition duration-200">
                    <div className="font-medium text-blue-900">Update Delivery Status</div>
                    <div className="text-sm text-blue-600">Modify shipment progress and status</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Shipping Analytics */}
            <div className="bg-white shadow-sm rounded-lg border border-blue-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-blue-900 mb-4">Analytics & Reports</h2>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition duration-200">
                    <div className="font-medium text-blue-900">Delivery Performance</div>
                    <div className="text-sm text-blue-600">Analyze delivery times and efficiency</div>
                  </button>
                  <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition duration-200">
                    <div className="font-medium text-blue-900">Shipping Costs</div>
                    <div className="text-sm text-blue-600">Review shipping expenses and trends</div>
                  </button>
                  <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition duration-200">
                    <div className="font-medium text-blue-900">Route Optimization</div>
                    <div className="text-sm text-blue-600">Optimize delivery routes and schedules</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Active Shipments */}
          <div className="bg-white shadow-sm rounded-lg border border-blue-100">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Active Shipments</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-blue-200">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                        Shipment ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                        Destination
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                        Products
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                        Est. Delivery
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-blue-100">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">
                        SHP-2024-001
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        Mumbai Central Station
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        Safety Equipment (x25)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                          In Transit
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        2024-09-15
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="text-blue-600 hover:text-blue-900">Track</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">
                        SHP-2024-002
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        Delhi Junction
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        Track Tools (x12)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        2024-09-18
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="text-blue-600 hover:text-blue-900">Update</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">
                        SHP-2024-003
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        Bangalore City Station
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        Signal Components (x8)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Delivered
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        2024-09-10
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="text-blue-600 hover:text-blue-900">View</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}