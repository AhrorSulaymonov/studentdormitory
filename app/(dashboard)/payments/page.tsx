"use client";

import { useState, useEffect } from "react";
import { Payment, Student, Room } from "@/lib/types";
import {
  getPayments,
  updatePayment,
  getStudents,
  getRooms,
} from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { formatDate, formatCurrency, getMonthName } from "@/lib/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [students, setStudents] = useState<Record<string, Student>>({});
  const [rooms, setRooms] = useState<Record<string, Room>>({});
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const paymentsData = getPayments();
    const paymentsArray = Object.values(paymentsData);
    setPayments(paymentsArray);
    setStudents(getStudents());
    setRooms(getRooms());
  };

  const getFilteredPayments = () => {
    switch (activeTab) {
      case "paid":
        return payments.filter((p) => p.status === "paid");
      case "unpaid":
        return payments.filter(
          (p) => p.status === "unpaid" || p.status === "partial",
        );
      case "overdue":
        return payments.filter((p) => p.status === "overdue");
      default:
        return payments;
    }
  };

  const handleMarkAsPaid = (payment: Payment) => {
    const newPayment = {
      ...payment,
      status: "paid" as const,
      paidDate: new Date().toISOString().split("T")[0],
    };
    updatePayment(payment.id, newPayment);
    toast({
      title: "Muvaffaqiyat",
      description: "To'lov muvaffaqiyatli belgilandi",
    });
    loadData();
  };

  const stats = {
    total: payments.length,
    paid: payments.filter((p) => p.status === "paid").length,
    unpaid: payments.filter(
      (p) => p.status === "unpaid" || p.status === "partial",
    ).length,
    overdue: payments.filter((p) => p.status === "overdue").length,
    totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
    paidAmount: payments
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + p.amount, 0),
  };

  const filteredPayments = getFilteredPayments();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          To'lovlar
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Jami to'lovlar: {stats.total}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm">To'landi</p>
          <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
          <p className="text-xs text-gray-500 mt-1">
            {formatCurrency(stats.paidAmount)}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm">To'lanmadi</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.unpaid}</p>
        </Card>
        <Card className="p-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Muddati o'tgan
          </p>
          <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
        </Card>
        <Card className="p-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Jami summa</p>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(stats.totalAmount)}
          </p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Hammasini ({stats.total})</TabsTrigger>
          <TabsTrigger value="paid">To'landi ({stats.paid})</TabsTrigger>
          <TabsTrigger value="unpaid">To'lanmadi ({stats.unpaid})</TabsTrigger>
          <TabsTrigger value="overdue">
            Muddati o'tgan ({stats.overdue})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredPayments.length > 0 ? (
            <div className="space-y-3">
              {filteredPayments.map((payment) => {
                const student = students[payment.studentId];
                const room = rooms[payment.roomId];
                const statusIcon = {
                  paid: <CheckCircle className="w-5 h-5 text-green-600" />,
                  unpaid: <Clock className="w-5 h-5 text-yellow-600" />,
                  partial: <Clock className="w-5 h-5 text-yellow-600" />,
                  overdue: <AlertCircle className="w-5 h-5 text-red-600" />,
                }[payment.status];

                return (
                  <Card key={payment.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3 flex-1">
                        <div>{statusIcon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {student?.fullName}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {getMonthName(
                              `${payment.month.split("-")[0]}-${payment.month.split("-")[1]}`,
                            )}{" "}
                            - {room ? `Xona ${room.number}` : "No room"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            Muddati: {formatDate(payment.dueDate)}
                            {payment.paidDate &&
                              ` • To'langan: ${formatDate(payment.paidDate)}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {formatCurrency(payment.amount)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {payment.method && `Usul: ${payment.method}`}
                        </p>
                        {payment.status !== "paid" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2"
                            onClick={() => handleMarkAsPaid(payment)}
                          >
                            To'langan deb belgilash
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                Bu toifada to'lovlar yo'q
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
