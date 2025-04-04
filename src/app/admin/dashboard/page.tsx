"use client"
import React, { useState } from 'react';

const DashboardLayout = () => {
    const [activeUsers, setActiveUsers] = useState(3);
    const [totalProducts, setTotalProducts] = useState(15);
    const [totalAmount, setTotalAmount] = useState(60000);
    const [totalOrders, setTotalOrders] = useState(10);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-md">
                {/* Logo */}
               

                {/* Navigation */}
                <nav className="mt-4">
                    <div className="px-4 py-2">
                        <h2 className="text-lg font-medium text-gray-700">Dashboard</h2>
                        <ul className="mt-2 space-y-1">
                            <li className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                <a href="#" className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                                    </svg>
                                    Dashboard
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Manage User Section */}
                    <div className="px-4 py-2 mt-4">
                        <h2 className="text-lg font-medium text-gray-700">Manage User</h2>
                        <ul className="mt-2 space-y-1">
                            <li className="px-2 py-1 text-gray-700 hover:bg-blue-100 hover:text-blue-700 rounded">
                                <a href="#" className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                    View Users
                                </a>
                            </li>
                            <li className="px-2 py-1 text-gray-700 hover:bg-blue-100 hover:text-blue-700 rounded">
                                <a href="#" className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                    </svg>
                                    Edit User
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Product Section */}
                    <div className="px-4 py-2 mt-4">
                        <h2 className="text-lg font-medium text-gray-700">Product</h2>
                        <ul className="mt-2 space-y-1">
                            <li className="px-2 py-1 text-gray-700 hover:bg-blue-100 hover:text-blue-700 rounded">
                                <a href="#" className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                    </svg>
                                    Add Product
                                </a>
                            </li>
                            <li className="px-2 py-1 text-gray-700 hover:bg-blue-100 hover:text-blue-700 rounded">
                                <a href="#" className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                    Delete Product
                                </a>
                            </li>
                            <li className="px-2 py-1 text-gray-700 hover:bg-blue-100 hover:text-blue-700 rounded">
                                <a href="#" className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                    </svg>
                                    Add Category
                                </a>
                            </li>
                            <li className="px-2 py-1 text-gray-700 hover:bg-blue-100 hover:text-blue-700 rounded">
                                <a href="#" className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                    Delete Category
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                {/* Header */}
                <header className="bg-white shadow">
                    <div className="flex justify-between items-center px-6 py-4">
                        <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
                        <div className="flex items-center">
                            <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                                Hi, Admin
                            </button>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="p-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Active Users */}
                        <div className="bg-white p-6 rounded shadow">
                            <h3 className="text-lg font-medium text-gray-700">Registered Active Users</h3>
                            <div className="mt-2">
                                <p className="text-3xl font-bold text-blue-600">Ex: {activeUsers}</p>
                                <div className="mt-4">
                                    <p className="text-sm text-gray-500">Shows user (email), name (readonly)</p>
                                    <p className="text-sm text-gray-500">Edit user (name, email)</p>
                                </div>
                            </div>
                        </div>

                        {/* Total Products */}
                        <div className="bg-white p-6 rounded shadow">
                            <h3 className="text-lg font-medium text-gray-700">Total Products</h3>
                            <div className="mt-2">
                                <p className="text-3xl font-bold text-blue-600">Ex: {totalProducts}</p>
                                <div className="mt-4">
                                    <p className="text-sm text-gray-500">Can add Product</p>
                                    <p className="text-sm text-gray-500">Shows list & can del Product</p>
                                </div>
                            </div>
                        </div>

                        {/* Total Orders */}
                        <div className="bg-white p-6 rounded shadow">
                            <h3 className="text-lg font-medium text-gray-700">Total Orders</h3>
                            <div className="mt-2">
                                <p className="text-3xl font-bold text-blue-600">{totalOrders}</p>
                            </div>
                        </div>
                    </div>

                    {/* Second row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        {/* Manage Users */}
                        <div className="bg-white p-6 rounded shadow">
                            <h3 className="text-lg font-medium text-gray-700">Manage Users</h3>
                            <table className="min-w-full divide-y divide-gray-200 mt-4">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">John Doe</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">john@example.com</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button className="text-blue-600 hover:text-blue-900">Edit</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Jane Smith</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">jane@example.com</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button className="text-blue-600 hover:text-blue-900">Edit</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Bob Johnson</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">bob@example.com</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button className="text-blue-600 hover:text-blue-900">Edit</button>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Total Amount */}
                        <div className="bg-white p-6 rounded shadow">
                            <h3 className="text-lg font-medium text-gray-700">Total Amount</h3>
                            <div className="mt-2">
                                <p className="text-3xl font-bold text-green-600">₹{totalAmount.toLocaleString()}</p>
                            </div>
                            <div className="mt-6">
                                <h4 className="text-md font-medium text-gray-700">Categories</h4>
                                <table className="min-w-full divide-y divide-gray-200 mt-4">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Electronics</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button className="text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Clothing</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button className="text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Accessories</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button className="text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;