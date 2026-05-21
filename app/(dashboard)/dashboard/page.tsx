"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { getRooms, getStudents, getPayments } from "@/lib/storage";
import { Room, Student, Payment } from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DoorOpen, Users, AlertCircle, TrendingDown } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/constants";

export default function DashboardPage() {
  const [rooms, setRooms] = useState<Record<string, Room>>({});
  const [students, setStudents] = useState<Record<string, Student>>({});
  const [payments, setPayments] = useState<Record<string, Payment>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setRooms(getRooms());
    setStudents(getStudents());
    setPayments(getPayments());
    setLoading(false);
  }, []);

  const stats = {
    totalRooms: Object.values(rooms).length,
    occupiedRooms: Object.values(rooms).filter((r) => r.status === "occupied")
      .length,
    totalStudents: Object.values(students).length,
    activeStudents: Object.values(students).filter((s) => s.status === "active")
      .length,
    totalPayments: Object.values(payments).length,
    unpaidPayments: Object.values(payments).filter(
      (p) => p.status === "unpaid" || p.status === "overdue",
    ).length,
    totalRevenue: Object.values(payments)
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + p.amount, 0),
  };

  const overduPayments = Object.values(payments).filter(
    (p) => p.status === "overdue",
  );

  const chartData = [
    { name: "Mavjud", value: stats.totalRooms - stats.occupiedRooms },
    { name: "Band", value: stats.occupiedRooms },
  ];

  if (loading) {
    return <div>Yuklanmoqda...</div>;
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Bosh sahifa
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 md:mt-2">
          Turar joy boshqaruv tizimiga xush kelibsiz
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        <StatsCard
          title="Jami xonalar"
          value={stats.totalRooms}
          icon={DoorOpen}
          color="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100"
        />
        <StatsCard
          title="Band xonalar"
          value={stats.occupiedRooms}
          icon={DoorOpen}
          color="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
        />
        <StatsCard
          title="Jami talabalar"
          value={stats.totalStudents}
          icon={Users}
          color="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-100"
        />
        <StatsCard
          title="Faol talabalar"
          value={stats.activeStudents}
          icon={Users}
          color="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Occupancy Chart */}
        <div className="lg:col-span-2">
          <Card className="p-3 sm:p-4 md:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">
              Xona occupancy
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Payment Stats */}
        <Card className="p-3 sm:p-4 md:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">
            To'lovlar
          </h3>
          <div className="space-y-2 md:space-y-3">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Jami to'lovlar
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalPayments}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                To'lanmagan
              </p>
              <p className="text-xl sm:text-2xl font-bold text-red-600">
                {stats.unpaidPayments}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Jami daromad
              </p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Overdue Alerts */}
      {overduPayments.length > 0 && (
        <Card className="p-3 sm:p-4 md:p-6 border-l-4 border-red-500">
          <div className="flex items-start gap-3 md:gap-4">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 md:mb-3">
                Muddati o'tgan to'lovlar ({overduPayments.length})
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {overduPayments.slice(0, 5).map((payment) => {
                  const student = students[payment.studentId];
                  return (
                    <div
                      key={payment.id}
                      className="text-xs sm:text-sm text-gray-600 dark:text-gray-400"
                    >
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {student?.fullName}
                      </p>
                      <p className="truncate">
                        {formatCurrency(payment.amount)} - muddati:{" "}
                        {formatDate(payment.dueDate)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

function StatsCard({ title, value, icon: Icon, color }: StatsCardProps) {
  return (
    <Card className="p-2 sm:p-3 md:p-4 lg:p-6">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
            {title}
          </p>
          <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mt-1">
            {value}
          </p>
        </div>
        <div className={`p-2 sm:p-3 rounded-lg shrink-0 ${color}`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
        </div>
      </div>
    </Card>
  );
}
