"use client";
import { useState } from "react";
import Link from "next/link";

export default function Inventory() {
  const [inventoryStats] = useState({
    totalItems: 1247,
    lowStock: 23,
    outOfStock: 5,
    totalValue: 892400
  });

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-900">Inventory Management</h1>
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
          {/* Inventory Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-blue-100">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">📦</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-blue-900">Total Items</h3>
                    <p className="text-3xl font-bold text-blue-600">{inventoryStats.totalItems}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-blue-100">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">⚠️</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-blue-900">Low Stock</h3>
                    <p className="text-3xl font-bold text-yellow-600">{inventoryStats.lowStock}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-blue-100">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">❌</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-blue-900">Out of Stock</h3>
                    <p className="text-3xl font-bold text-red-600">{inventoryStats.outOfStock}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-blue-100">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">💰</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-blue-900">Total Value</h3>
                    <p className="text-3xl font-bold text-blue-600">${inventoryStats.totalValue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Stock Management */}
            <div className="bg-white shadow-sm rounded-lg border border-blue-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-blue-900 mb-4">Stock Management</h2>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition duration-200">
                    <div className="font-medium text-blue-900">Add New Item</div>
                    <div className="text-sm text-blue-600">Add products to your inventory</div>
                  </button>
                  <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition duration-200">
                    <div className="font-medium text-blue-900">Update Stock Levels</div>
                    <div className="text-sm text-blue-600">Adjust inventory quantities</div>
                  </button>
                  <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition duration-200">
                    <div className="font-medium text-blue-900">Bulk Import</div>
                    <div className="text-sm text-blue-600">Import inventory data from CSV</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Inventory Reports */}
            <div className="bg-white shadow-sm rounded-lg border border-blue-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-blue-900 mb-4">Reports & Analytics</h2>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition duration-200">
                    <div className="font-medium text-blue-900">Stock Report</div>
                    <div className="text-sm text-blue-600">Generate detailed inventory reports</div>
                  </button>
                  <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition duration-200">
                    <div className="font-medium text-blue-900">Low Stock Alerts</div>
                    <div className="text-sm text-blue-600">Configure automatic stock alerts</div>
                  </button>
                  <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition duration-200">
                    <div className="font-medium text-blue-900">Inventory Trends</div>
                    <div className="text-sm text-blue-600">Analyze inventory movement patterns</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Current Inventory */}
          <div className="bg-white shadow-sm rounded-lg border border-blue-100">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Current Inventory</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-blue-200">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                        Product ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                        Product Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                        Stock Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-blue-100">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">
                        PRD-001
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        Railway Safety Equipment
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        Safety
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        156 units
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        $125.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          In Stock
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">
                        PRD-002
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        Track Maintenance Tools
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        Maintenance
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        8 units
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        $875.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Low Stock
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">
                        PRD-003
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        Signal System Components
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        Electronics
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        0 units
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        $2,500.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          Out of Stock
                        </span>
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