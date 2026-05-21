"use client";

import { useState, useEffect } from "react";
import { Payment, Student, Room } from "@/lib/types";
import {
  getPayments,
  updatePayment,
  getStudents,
  getRooms,
  addPayment,
} from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { formatDate, formatCurrency, getMonthName } from "@/lib/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";
import { generatePaymentMonths } from "@/lib/payment-utils";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [students, setStudents] = useState<Record<string, Student>>({});
  const [rooms, setRooms] = useState<Record<string, Room>>({});
  const [activeTab, setActiveTab] = useState("all");
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "history">("list");
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

  const getStudentPaymentHistory = (studentId: string) => {
    const student = students[studentId];
    if (!student) return [];

    const studentPayments = payments.filter((p) => p.studentId === studentId);
    const paidMonths = studentPayments
      .filter((p) => p.status === "paid")
      .map((p) => p.month);

    const checkInDate = student.checkInDate
      ? new Date(student.checkInDate)
      : new Date();
    const checkOutDate = student.checkOutDate
      ? new Date(student.checkOutDate)
      : null;

    return generatePaymentMonths(
      checkInDate,
      checkOutDate,
      paidMonths,
      new Date(),
    );
  };

  const handleCreatePaymentForMonth = (
    studentId: string,
    year: number,
    month: number,
    pricePerMonth: number,
  ) => {
    const student = students[studentId];
    const room = student.roomId ? rooms[student.roomId] : null;

    if (!student || !room) {
      toast({
        variant: "destructive",
        title: "Xato",
        description: "Talaba yoki xona topilmadi",
      });
      return;
    }

    const monthKey = `${year}-${String(month).padStart(2, "0")}`;
    const dueDay = 15; // To'lov muddati: har oyning 15-kuni

    const newPayment: Payment = {
      id: `payment-${Date.now()}`,
      studentId,
      roomId: room.id,
      amount: pricePerMonth,
      month: monthKey,
      dueDate: new Date(year, month - 1, dueDay).toISOString(),
      paidDate: null,
      status: "unpaid",
      method: null,
      notes: "",
    };

    addPayment(newPayment);
    toast({
      title: "Muvaffaqiyat",
      description: `${monthKey} oyi uchun to'lov yozuvi yaratildi`,
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
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 md:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            To'lovlar
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 md:mt-2">
            Jami to'lovlar: {stats.total}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            onClick={() => setViewMode("list")}
            className="text-xs sm:text-sm"
          >
            Ro'yxat
          </Button>
          <Button
            variant={viewMode === "history" ? "default" : "outline"}
            onClick={() => setViewMode("history")}
            className="text-xs sm:text-sm"
          >
            Talaba tarixi
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        <Card className="p-2 sm:p-3 md:p-4">
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
            To'landi
          </p>
          <p className="text-lg md:text-2xl font-bold text-green-600">
            {stats.paid}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {formatCurrency(stats.paidAmount)}
          </p>
        </Card>
        <Card className="p-2 sm:p-3 md:p-4">
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
            To'lanmadi
          </p>
          <p className="text-lg md:text-2xl font-bold text-yellow-600">
            {stats.unpaid}
          </p>
        </Card>
        <Card className="p-2 sm:p-3 md:p-4">
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
            Muddati o'tgan
          </p>
          <p className="text-lg md:text-2xl font-bold text-red-600">
            {stats.overdue}
          </p>
        </Card>
        <Card className="p-2 sm:p-3 md:p-4">
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
            Jami summa
          </p>
          <p className="text-lg md:text-2xl font-bold text-blue-600">
            {formatCurrency(stats.totalAmount)}
          </p>
        </Card>
      </div>

      {/* View Mode Content */}
      {viewMode === "list" && (
        <>
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full flex flex-wrap gap-1 h-auto bg-transparent p-0">
              <TabsTrigger value="all" className="text-xs md:text-sm">
                Hammasini ({stats.total})
              </TabsTrigger>
              <TabsTrigger value="paid" className="text-xs md:text-sm">
                To'landi ({stats.paid})
              </TabsTrigger>
              <TabsTrigger value="unpaid" className="text-xs md:text-sm">
                To'lanmadi ({stats.unpaid})
              </TabsTrigger>
              <TabsTrigger value="overdue" className="text-xs md:text-sm">
                Muddati o'tgan ({stats.overdue})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-2 md:space-y-3">
              {filteredPayments.length > 0 ? (
                <div className="space-y-2 md:space-y-3">
                  {filteredPayments.map((payment) => {
                    const student = students[payment.studentId];
                    const room = rooms[payment.roomId];
                    const statusIcon = {
                      paid: (
                        <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                      ),
                      unpaid: (
                        <Clock className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
                      ),
                      partial: (
                        <Clock className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
                      ),
                      overdue: (
                        <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
                      ),
                    }[payment.status];

                    return (
                      <Card key={payment.id} className="p-2 md:p-4">
                        <div className="flex justify-between items-start gap-2 md:gap-3">
                          <div className="flex gap-2 md:gap-3 flex-1 min-w-0">
                            <div className="flex-shrink-0 mt-1">
                              {statusIcon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white truncate">
                                {student?.fullName}
                              </h3>
                              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate">
                                {getMonthName(
                                  `${payment.month.split("-")[0]}-${payment.month.split("-")[1]}`,
                                )}{" "}
                                - {room ? `Xona ${room.number}` : "No room"}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 truncate">
                                Muddati: {formatDate(payment.dueDate)}
                                {payment.paidDate &&
                                  ` • To'langan: ${formatDate(payment.paidDate)}`}
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
                              {formatCurrency(payment.amount)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              {payment.method && `Usul: ${payment.method}`}
                            </p>
                            {payment.status !== "paid" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="mt-1 md:mt-2 text-xs"
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
                <div className="text-center py-8 md:py-12">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Bu toifada to'lovlar yo'q
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* History View */}
      {viewMode === "history" && (
        <div className="space-y-2 md:space-y-3">
          <div className="space-y-3">
            {Object.values(students).map((student) => {
              const paymentHistory = getStudentPaymentHistory(student.id);
              const room = student.roomId ? rooms[student.roomId] : null;
              const isExpanded = expandedStudent === student.id;

              return (
                <Card key={student.id} className="overflow-hidden">
                  <div
                    className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 flex justify-between items-center"
                    onClick={() =>
                      setExpandedStudent(isExpanded ? null : student.id)
                    }
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {student.fullName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {room ? `Xona ${room.number}` : "Xonasi yo'q"} •{" "}
                        {
                          paymentHistory.filter((p) => p.status === "paid")
                            .length
                        }{" "}
                        /{paymentHistory.length} to'langan
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-200 dark:border-gray-800 p-4 space-y-2">
                      {paymentHistory.length > 0 ? (
                        <>
                          {paymentHistory.map((month) => {
                            const existingPayment = payments.find(
                              (p) =>
                                p.studentId === student.id &&
                                p.month ===
                                  `${month.year}-${String(month.month).padStart(2, "0")}`,
                            );

                            const statusColor = {
                              paid: "bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700",
                              unpaid:
                                "bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700",
                              upcoming:
                                "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700",
                            }[month.status];

                            const statusIcon = {
                              paid: (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ),
                              unpaid: (
                                <Clock className="w-4 h-4 text-yellow-600" />
                              ),
                              upcoming: (
                                <Clock className="w-4 h-4 text-gray-400" />
                              ),
                            }[month.status];

                            return (
                              <div
                                key={`${month.year}-${month.month}`}
                                className={`flex justify-between items-center p-2 border rounded ${statusColor}`}
                              >
                                <div className="flex items-center gap-2 flex-1">
                                  {statusIcon}
                                  <span className="text-sm font-medium">
                                    {month.label}
                                  </span>
                                  {month.isCurrent && (
                                    <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100 px-2 py-0.5 rounded">
                                      Joriy
                                    </span>
                                  )}
                                  {month.isCheckoutMonth && (
                                    <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-100 px-2 py-0.5 rounded">
                                      Chiqish
                                    </span>
                                  )}
                                </div>
                                <div className="flex gap-1">
                                  {existingPayment ? (
                                    <>
                                      <span className="text-xs text-gray-600 dark:text-gray-400">
                                        {formatCurrency(existingPayment.amount)}
                                      </span>
                                      {existingPayment.status !== "paid" && (
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="h-6 px-2 text-xs"
                                          onClick={() =>
                                            handleMarkAsPaid(existingPayment)
                                          }
                                        >
                                          To'lash
                                        </Button>
                                      )}
                                    </>
                                  ) : month.status !== "upcoming" ? (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-6 px-2 text-xs gap-1"
                                      onClick={() =>
                                        handleCreatePaymentForMonth(
                                          student.id,
                                          month.year,
                                          month.month,
                                          room?.pricePerMonth || 0,
                                        )
                                      }
                                    >
                                      <Plus className="w-3 h-3" />
                                      Yaratish
                                    </Button>
                                  ) : null}
                                </div>
                              </div>
                            );
                          })}
                        </>
                      ) : (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Bu talaba uchun to'lov tarixi mavjud emas
                        </p>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
