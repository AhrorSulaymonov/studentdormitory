"use client";

import { useState, useEffect } from "react";
import { Student, Room } from "@/lib/types";
import { FACULTIES } from "@/lib/constants";
import { getRooms } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StudentFormProps {
  open: boolean;
  student?: Student | null;
  onSave: (student: Student) => void;
  onClose: () => void;
}

export function StudentForm({
  open,
  student,
  onSave,
  onClose,
}: StudentFormProps) {
  const rooms = getRooms();
  const roomArray = Object.values(rooms) as Room[];

  const [formData, setFormData] = useState<Student>(
    student || {
      id: "",
      fullName: "",
      studentId: "",
      faculty: FACULTIES[0],
      year: 1,
      phone: "",
      email: "",
      roomId: null,
      checkInDate: null,
      checkOutDate: null,
      status: "active",
      photoUrl: "",
    },
  );

  useEffect(() => {
    if (student) {
      setFormData(student);
    } else {
      setFormData({
        id: "",
        fullName: "",
        studentId: "",
        faculty: FACULTIES[0],
        year: 1,
        phone: "",
        email: "",
        roomId: null,
        checkInDate: null,
        checkOutDate: null,
        status: "active",
        photoUrl: "",
      });
    }
  }, [student, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id) {
      formData.id = `student-${Date.now()}`;
    }
    if (!formData.photoUrl) {
      formData.photoUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.fullName.replace(/\s+/g, "")}`;
    }
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {student ? "Talabani tahrirlash" : "Yangi talaba qo'shish"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                To&apos;liq ismi
              </label>
              <Input
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                placeholder="Ism Familya"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Talaba ID
              </label>
              <Input
                value={formData.studentId}
                onChange={(e) =>
                  setFormData({ ...formData, studentId: e.target.value })
                }
                placeholder="STU001"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fakultet
              </label>
              <Select
                value={formData.faculty}
                onValueChange={(value) =>
                  setFormData({ ...formData, faculty: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FACULTIES.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Kurs
              </label>
              <Select
                value={formData.year.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, year: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1-kurs</SelectItem>
                  <SelectItem value="2">2-kurs</SelectItem>
                  <SelectItem value="3">3-kurs</SelectItem>
                  <SelectItem value="4">4-kurs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Telefon
              </label>
              <Input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+998..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Xona
              </label>
              <Select
                value={formData.roomId || "none"}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    roomId: value === "none" ? null : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Xona tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Xona tanlanmadi</SelectItem>
                  {roomArray.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      Xona {room.number} ({room.building})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Holati
              </label>
              <Select
                value={formData.status}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Faol</SelectItem>
                  <SelectItem value="inactive">Faol emas</SelectItem>
                  <SelectItem value="graduated">Bitirdi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Bekor qilish
            </Button>
            <Button type="submit">Saqlash</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
