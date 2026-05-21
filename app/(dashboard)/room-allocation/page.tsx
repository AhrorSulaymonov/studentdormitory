"use client";

import { useState, useEffect } from "react";
import { Room, Student } from "@/lib/types";
import { getRooms, getStudents, updateStudent } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BUILDINGS, FLOORS } from "@/lib/constants";
import { X } from "lucide-react";

export default function RoomAllocationPage() {
  const [rooms, setRooms] = useState<Record<string, Room>>({});
  const [students, setStudents] = useState<Record<string, Student>>({});
  const [selectedBuilding, setSelectedBuilding] = useState<string>("A");
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    setRooms(getRooms());
    setStudents(getStudents());
  }, []);

  const getRoomsByLocation = () => {
    return Object.values(rooms).filter(
      (r) => r.building === selectedBuilding && r.floor === selectedFloor,
    );
  };

  const getOccupants = (roomId: string) => {
    return Object.values(students).filter((s) => s.roomId === roomId);
  };

  const getUnassignedStudents = () => {
    return Object.values(students).filter(
      (s) => s.status === "active" && !s.roomId,
    );
  };

  const handleAssignStudent = (roomId: string) => {
    if (!selectedStudent) {
      toast({
        variant: "destructive",
        title: "Xato",
        description: "Talaba tanlang",
      });
      return;
    }

    const student = students[selectedStudent];
    const room = rooms[roomId];

    if (!student || !room) return;

    const occupants = getOccupants(roomId).length;
    if (occupants >= room.capacity) {
      toast({
        variant: "destructive",
        title: "Xato",
        description: "Xona to'liq",
      });
      return;
    }

    updateStudent(selectedStudent, {
      roomId,
      checkInDate: new Date().toISOString().split("T")[0],
    });

    setRooms(getRooms());
    setStudents(getStudents());
    setSelectedStudent("");

    toast({
      title: "Muvaffaqiyat",
      description: `${student.fullName} muvaffaqiyatli joylashtiruldi`,
    });
  };

  const handleRemoveStudent = (studentId: string) => {
    updateStudent(studentId, {
      roomId: null,
      checkInDate: null,
    });
    setRooms(getRooms());
    setStudents(getStudents());
    toast({
      title: "Muvaffaqiyat",
      description: "Talaba xonadan o'chirildi",
    });
  };

  const roomsInLocation = getRoomsByLocation();
  const unassignedStudents = getUnassignedStudents();

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Xona joylashtirish
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 md:mt-2">
          Talabalarni xonalarga joylashtirish
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        <div className="flex-1">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Bino
          </label>
          <Select value={selectedBuilding} onValueChange={setSelectedBuilding}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BUILDINGS.map((b) => (
                <SelectItem key={b} value={b}>
                  {b} - bino
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Qavat
          </label>
          <Select
            value={selectedFloor.toString()}
            onValueChange={(v) => setSelectedFloor(parseInt(v))}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FLOORS.map((f) => (
                <SelectItem key={f} value={f.toString()}>
                  {f}-qavat
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6">
        {/* Floor Plan */}
        <div className="lg:col-span-2 space-y-3 md:space-y-4">
          <h2 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white">
            {selectedBuilding} - bino, {selectedFloor}-qavat
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
            {roomsInLocation.length > 0 ? (
              roomsInLocation.map((room) => {
                const occupants = getOccupants(room.id);
                const isFull = occupants.length >= room.capacity;
                const isSelected = selectedRoom?.id === room.id;

                return (
                  <Card
                    key={room.id}
                    className={`p-2 md:p-4 cursor-pointer transition-all text-center ${
                      isSelected ? "ring-2 ring-blue-500" : "hover:shadow-md"
                    } ${
                      isFull
                        ? "bg-red-50 dark:bg-red-900"
                        : room.status === "maintenance"
                          ? "bg-yellow-50 dark:bg-yellow-900"
                          : "bg-green-50 dark:bg-green-900"
                    }`}
                    onClick={() => setSelectedRoom(room)}
                  >
                    <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
                      Xona {room.number}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                      {occupants.length}/{room.capacity} o&apos;rin
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {room.type === "single" && "Bitta o'rinli"}
                      {room.type === "double" && "Ikki o'rinli"}
                      {room.type === "triple" && "Uch o'rinli"}
                    </p>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">
                  Bu qavatta xona yo&apos;q
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Room Details & Assign */}
        <Card className="p-3 md:p-6 h-fit">
          {selectedRoom ? (
            <>
              <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
                Xona {selectedRoom.number} - Batafsil
              </h3>

              <div className="space-y-3 md:space-y-4">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Sig&apos;imi
                  </p>
                  <p className="text-sm md:text-base font-medium text-gray-900 dark:text-white">
                    {selectedRoom.capacity} o&apos;rin
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Holati
                  </p>
                  <p className="text-sm md:text-base font-medium text-gray-900 dark:text-white">
                    {selectedRoom.status === "available" && "Mavjud"}
                    {selectedRoom.status === "occupied" && "Band"}
                    {selectedRoom.status === "maintenance" && "Remontda"}
                  </p>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 md:pt-4">
                  <p className="text-xs md:text-sm font-medium text-gray-900 dark:text-white mb-2 md:mb-3">
                    Joylashtiriliganlar ({getOccupants(selectedRoom.id).length})
                  </p>
                  {getOccupants(selectedRoom.id).length > 0 ? (
                    <div className="space-y-1 md:space-y-2 max-h-40 overflow-y-auto">
                      {getOccupants(selectedRoom.id).map((student) => (
                        <div
                          key={student.id}
                          className="flex justify-between items-center text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded"
                        >
                          <span className="text-gray-900 dark:text-white truncate">
                            {student.fullName}
                          </span>
                          <button
                            onClick={() => handleRemoveStudent(student.id)}
                            className="text-red-600 hover:text-red-700 flex-shrink-0 ml-2"
                          >
                            <X className="w-3 h-3 md:w-4 md:h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Joylashtirulgan talaba yo&apos;q
                    </p>
                  )}
                </div>

                {getOccupants(selectedRoom.id).length <
                  selectedRoom.capacity && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 md:pt-4 space-y-2 md:space-y-3">
                    <Select
                      value={selectedStudent}
                      onValueChange={setSelectedStudent}
                    >
                      <SelectTrigger className="text-xs md:text-sm">
                        <SelectValue placeholder="Talaba tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        {unassignedStudents.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() => handleAssignStudent(selectedRoom.id)}
                      className="w-full text-xs md:text-sm"
                      disabled={!selectedStudent}
                    >
                      Joylashtirish
                    </Button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center text-xs md:text-sm text-gray-600 dark:text-gray-400">
              <p>Xona tanlang</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
