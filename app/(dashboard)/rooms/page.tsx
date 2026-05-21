"use client";

import { useState, useEffect } from "react";
import { Room } from "@/lib/types";
import { getRooms, addRoom, updateRoom, deleteRoom } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RoomForm } from "@/components/forms/room-form";
import { RoomCard } from "@/components/rooms/room-card";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Search } from "lucide-react";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [search, setSearch] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadRooms();
  }, []);

  useEffect(() => {
    const filtered = rooms.filter(
      (room) =>
        room.number.toLowerCase().includes(search.toLowerCase()) ||
        room.building.toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredRooms(filtered);
  }, [search, rooms]);

  const loadRooms = () => {
    const data = getRooms();
    const roomsArray = Object.values(data);
    setRooms(roomsArray);
  };

  const handleAddRoom = () => {
    setSelectedRoom(null);
    setOpenForm(true);
  };

  const handleEditRoom = (room: Room) => {
    setSelectedRoom(room);
    setOpenForm(true);
  };

  const handleSaveRoom = (room: Room) => {
    if (selectedRoom) {
      updateRoom(room.id, room);
      toast({
        title: "Muvaffaqiyat",
        description: "Xona muvaffaqiyatli yangilandi",
      });
    } else {
      addRoom(room);
      toast({
        title: "Muvaffaqiyat",
        description: "Yangi xona muvaffaqiyatli qo'shildi",
      });
    }
    loadRooms();
  };

  const handleDeleteRoom = (roomId: string) => {
    deleteRoom(roomId);
    toast({
      title: "Muvaffaqiyat",
      description: "Xona muvaffaqiyatli o'chirildi",
    });
    loadRooms();
    setDeleteId(null);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 md:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Xonalar
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 md:mt-2">
            Jami xonalar: {rooms.length}
          </p>
        </div>
        <Button onClick={handleAddRoom} className="gap-2 w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          Yangi xona
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Xona raqami yoki binosi bo'yicha qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 text-sm"
        />
      </div>

      {/* Room Grid */}
      {filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {filteredRooms.map((room) => (
            <AlertDialog
              key={room.id}
              open={deleteId === room.id}
              onOpenChange={(open) => !open && setDeleteId(null)}
            >
              <RoomCard
                room={room}
                onEdit={handleEditRoom}
                onDelete={() => setDeleteId(room.id)}
              />
              <AlertDialogContent>
                <AlertDialogTitle>Xonani o'chirish</AlertDialogTitle>
                <AlertDialogDescription>
                  Xona {room.number}ni o'chirmoqchisiz? Bu amalni qaytarib
                  bo'lmaydi.
                </AlertDialogDescription>
                <div className="flex gap-2 justify-end">
                  <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeleteRoom(room.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    o'chirish
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            {search ? "Xonalar topilmadi" : "Hali xona qo'shilmagan"}
          </p>
        </div>
      )}

      <RoomForm
        open={openForm}
        room={selectedRoom}
        onSave={handleSaveRoom}
        onClose={() => setOpenForm(false)}
      />
    </div>
  );
}
