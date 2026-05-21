"use client";

import { useState, useEffect } from "react";
import { Student, Room } from "@/lib/types";
import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  getRooms,
} from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { StudentForm } from "@/components/forms/student-form";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Search, Mail, Phone, Edit2, Trash2 } from "lucide-react";
import Image from "next/image";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [rooms, setRooms] = useState<Record<string, Room>>({});
  const [search, setSearch] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const filtered = students.filter(
      (student) =>
        student.fullName.toLowerCase().includes(search.toLowerCase()) ||
        student.studentId.toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredStudents(filtered);
  }, [search, students]);

  const loadData = () => {
    const data = getStudents();
    const studentsArray = Object.values(data);
    setStudents(studentsArray);
    setRooms(getRooms());
  };

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setOpenForm(true);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setOpenForm(true);
  };

  const handleSaveStudent = (student: Student) => {
    if (selectedStudent) {
      updateStudent(student.id, student);
      toast({
        title: "Muvaffaqiyat",
        description: "Talaba muvaffaqiyatli yangilandi",
      });
    } else {
      addStudent(student);
      toast({
        title: "Muvaffaqiyat",
        description: "Yangi talaba muvaffaqiyatli qo'shildi",
      });
    }
    loadData();
  };

  const handleDeleteStudent = (studentId: string) => {
    deleteStudent(studentId);
    toast({
      title: "Muvaffaqiyat",
      description: "Talaba muvaffaqiyatli o'chirildi",
    });
    loadData();
    setDeleteId(null);
  };

  const getRoom = (roomId: string | null) => {
    return roomId ? rooms[roomId] : null;
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 md:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Talabalar
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 md:mt-2">
            Jami talabalar: {students.length}
          </p>
        </div>
        <Button onClick={handleAddStudent} className="gap-2 w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          Yangi talaba
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Ism yoki talaba ID bo'yicha qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 text-sm"
        />
      </div>

      {/* Student Cards */}
      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {filteredStudents.map((student) => {
            const room = getRoom(student.roomId);
            const statusLabel = {
              active: "Faol",
              inactive: "Faol emas",
              graduated: "Bitirdi",
            }[student.status];

            return (
              <Card key={student.id} className="p-3 md:p-4">
                <div className="flex gap-2 md:gap-4">
                  <div className="shrink-0">
                    <Image
                      src={student.photoUrl}
                      alt={student.fullName}
                      width={64}
                      height={64}
                      className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {student.fullName}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate">
                          {student.studentId}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 truncate">
                          {student.faculty} - {student.year}-kurs
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full shrink-0 whitespace-nowrap ${
                          student.status === "active"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100"
                        }`}
                      >
                        {statusLabel}
                      </span>
                    </div>

                    <div className="mt-2 md:mt-3 space-y-1">
                      {room && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          Xona:{" "}
                          <span className="font-medium">
                            Xona {room.number} ({room.building})
                          </span>
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1 md:gap-3 text-xs text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1 truncate">
                          <Phone className="w-3 h-3 shrink-0" />
                          <span className="truncate">{student.phone}</span>
                        </span>
                        <span className="flex items-center gap-1 truncate">
                          <Mail className="w-3 h-3 shrink-0" />
                          <span className="truncate">{student.email}</span>
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 md:mt-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-xs"
                        onClick={() => handleEditStudent(student)}
                      >
                        <Edit2 className="w-3 h-3" />
                        Tahrirlash
                      </Button>
                      <AlertDialog
                        open={deleteId === student.id}
                        onOpenChange={(open) => !open && setDeleteId(null)}
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                          onClick={() => setDeleteId(student.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                          O&apos;chirish
                        </Button>
                        <AlertDialogContent>
                          <AlertDialogTitle>
                            Talabani o&apos;chirish
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {student.fullName}ni o&apos;chirmoqchisiz? Bu amalni
                            qaytarib bo&apos;lmaydi.
                          </AlertDialogDescription>
                          <div className="flex gap-2 justify-end">
                            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteStudent(student.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              O&apos;chirish
                            </AlertDialogAction>
                          </div>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            {search ? "Talabalar topilmadi" : "Hali talaba qo'shilmagan"}
          </p>
        </div>
      )}

      <StudentForm
        open={openForm}
        student={selectedStudent}
        onSave={handleSaveStudent}
        onClose={() => setOpenForm(false)}
      />
    </div>
  );
}
