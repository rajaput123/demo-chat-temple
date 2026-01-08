/**
 * Booking and Allocation Management
 * 
 * Accommodation and event space booking management
 */

'use client';

import React, { useState } from 'react';
import { Calendar, MapPin, Users, DollarSign, Plus, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Booking } from '@/types/operations';
import { mockBookings } from '@/data/mockOperationsData';
import ChartContainer from '@/components/shared/charts/ChartContainer';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';

export default function BookingManagement() {
    const [bookings, setBookings] = useState<Booking[]>(mockBookings);
    const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'analytics'>('list');

    // Occupancy data (mock)
    const occupancyData = [
        { month: 'Jan', occupancy: 65, revenue: 120000 },
        { month: 'Feb', occupancy: 72, revenue: 135000 },
        { month: 'Mar', occupancy: 68, revenue: 128000 },
        { month: 'Apr', occupancy: 75, revenue: 142000 },
        { month: 'May', occupancy: 80, revenue: 150000 },
        { month: 'Jun', occupancy: 85, revenue: 160000 },
    ];

    // Booking type distribution
    const bookingTypeData = bookings.reduce(
        (acc, booking) => {
            acc[booking.bookingType] = (acc[booking.bookingType] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>
    );

    const typeChartData = Object.entries(bookingTypeData).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
    }));

    // Status distribution
    const statusData = bookings.reduce(
        (acc, booking) => {
            acc[booking.status] = (acc[booking.status] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>
    );

    const statusChartData = Object.entries(statusData).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
    }));

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <CheckCircle2 size={16} className="text-green-600" />;
            case 'pending':
                return <Clock size={16} className="text-yellow-600" />;
            case 'cancelled':
                return <XCircle size={16} className="text-red-600" />;
            default:
                return <CheckCircle2 size={16} className="text-slate-400" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-700';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700';
            case 'cancelled':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Booking & Allocation Management</h2>
                    <p className="text-sm text-slate-600 font-medium mt-1">Manage accommodations and event bookings</p>
                </div>
                <button className="px-4 py-2 bg-industrial-gray text-white rounded-lg hover:bg-industrial-gray/90 transition-colors flex items-center gap-2">
                    <Plus size={18} />
                    <span className="font-medium">New Booking</span>
                </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg w-fit">
                <button
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    List
                </button>
                <button
                    onClick={() => setViewMode('calendar')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        viewMode === 'calendar' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    Calendar
                </button>
                <button
                    onClick={() => setViewMode('analytics')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        viewMode === 'analytics' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    Analytics
                </button>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Area */}
                <div className="lg:col-span-2 space-y-6">
                    {viewMode === 'list' && (
                        <div className="bg-white/40 backdrop-blur-xl border border-neutral-200/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[24px] p-6">
                            <h3 className="text-sm font-black text-slate-900 mb-4 tracking-tight">Bookings</h3>
                            <div className="space-y-3">
                                {bookings.map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="p-4 bg-white/60 rounded-lg border border-slate-200/50 hover:border-slate-300/50 transition-all"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(booking.status)}
                                                <h4 className="font-black text-slate-900">{booking.resourceName}</h4>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusColor(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                        <div className="mb-2">
                                            <p className="text-sm font-medium text-slate-900">{booking.guestName}</p>
                                            <p className="text-xs text-slate-500">{booking.contactNumber}</p>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-slate-600">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} />
                                                {booking.checkInDate
                                                    ? `${new Date(booking.checkInDate).toLocaleDateString('en-US', {
                                                          month: 'short',
                                                          day: 'numeric',
                                                      })} - ${booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}`
                                                    : booking.eventDate
                                                    ? new Date(booking.eventDate).toLocaleDateString('en-US', {
                                                          month: 'short',
                                                          day: 'numeric',
                                                      })
                                                    : ''}
                                            </span>
                                            {booking.numberOfGuests && (
                                                <span className="flex items-center gap-1">
                                                    <Users size={12} />
                                                    {booking.numberOfGuests} guests
                                                </span>
                                            )}
                                            {booking.amount && (
                                                <span className="flex items-center gap-1">
                                                    <DollarSign size={12} />
                                                    ₹{booking.amount.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {viewMode === 'calendar' && (
                        <ChartContainer title="Booking Calendar">
                            <div className="p-6">
                                <div className="text-center py-12 text-slate-400 text-sm">
                                    Calendar view coming soon
                                </div>
                            </div>
                        </ChartContainer>
                    )}

                    {viewMode === 'analytics' && (
                        <>
                            <ChartContainer title="Occupancy & Revenue Trends">
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={occupancyData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
                                        <YAxis yAxisId="left" stroke="#64748b" style={{ fontSize: '12px' }} />
                                        <YAxis yAxisId="right" orientation="right" stroke="#64748b" style={{ fontSize: '12px' }} />
                                        <Tooltip />
                                        <Legend />
                                        <Line yAxisId="left" type="monotone" dataKey="occupancy" stroke="#3b82f6" strokeWidth={2} name="Occupancy %" />
                                        <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue (₹)" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Booking Type Distribution */}
                    <ChartContainer title="Booking Types">
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={typeChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '10px' }} />
                                <YAxis stroke="#64748b" style={{ fontSize: '10px' }} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#8b5cf6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>

                    {/* Status Distribution */}
                    <ChartContainer title="Status Distribution">
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={statusChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '10px' }} />
                                <YAxis stroke="#64748b" style={{ fontSize: '10px' }} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#10b981" />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>

                    {/* Quick Stats */}
                    <div className="bg-white/40 backdrop-blur-xl border border-neutral-200/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[24px] p-6">
                        <h3 className="text-sm font-black text-slate-900 mb-4 tracking-tight">Quick Stats</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Total Bookings</span>
                                <span className="text-lg font-black text-slate-900">{bookings.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Confirmed</span>
                                <span className="text-lg font-black text-green-600">
                                    {bookings.filter((b) => b.status === 'confirmed').length}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Total Revenue</span>
                                <span className="text-lg font-black text-slate-900">
                                    ₹{bookings.reduce((sum, b) => sum + (b.amount || 0), 0).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
