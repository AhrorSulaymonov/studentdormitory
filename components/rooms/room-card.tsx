"use client";

import { Room } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, STATUS_COLORS } from "@/lib/constants";
import { Edit2, Trash2, Users, DoorOpen } from "lucide-react";

interface RoomCardProps {
  room: Room;
  onEdit: (room: Room) => void;
  onDelete: (roomId: string) => void;
}

export function RoomCard({ room, onEdit, onDelete }: RoomCardProps) {
  const statusLabel = {
    available: "Mavjud",
    occupied: "Band",
    maintenance: "Remontda",
  }[room.status];

  const typeLabel = {
    single: "Bitta o'rinli",
    double: "Ikki o'rinli",
    triple: "Uch o'rinli",
  }[room.type];

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Xona {room.number}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {room.building} - bino, {room.floor}-qavat
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[room.status]}`}
        >
          {statusLabel}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="text-sm">
          <p className="text-gray-600 dark:text-gray-400">Turi</p>
          <p className="font-medium text-gray-900 dark:text-white">
            {typeLabel}
          </p>
        </div>
        <div className="text-sm">
          <p className="text-gray-600 dark:text-gray-400">Sig&apos;imi</p>
          <p className="font-medium text-gray-900 dark:text-white">
            {room.capacity} o&apos;rin
          </p>
        </div>
        <div className="text-sm">
          <p className="text-gray-600 dark:text-gray-400">Oylik narxi</p>
          <p className="font-medium text-gray-900 dark:text-white">
            {formatCurrency(room.pricePerMonth)}
          </p>
        </div>
        <div className="text-sm">
          <p className="text-gray-600 dark:text-gray-400">Band o&apos;rinlar</p>
          <p className="font-medium text-gray-900 dark:text-white">
            {room.currentOccupants || 0}/{room.capacity}
          </p>
        </div>
      </div>

      {room.amenities.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            Qulayliklar
          </p>
          <div className="flex flex-wrap gap-1">
            {room.amenities.map((amenity) => (
              <span
                key={amenity}
                className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100 rounded"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 gap-1"
          onClick={() => onEdit(room)}
        >
          <Edit2 className="w-4 h-4" />
          Tahrirlash
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 gap-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
          onClick={() => onDelete(room.id)}
        >
          <Trash2 className="w-4 h-4" />
          O&apos;chirish
        </Button>
      </div>
    </Card>
  );
}
