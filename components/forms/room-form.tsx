"use client";

import { useState, useEffect } from "react";
import { Room } from "@/lib/types";
import { AMENITIES, BUILDINGS, FLOORS } from "@/lib/constants";
import { getSettings } from "@/lib/storage";
import { defaultSettings } from "@/lib/seed-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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

interface RoomFormProps {
  open: boolean;
  room?: Room | null;
  onSave: (room: Room) => void;
  onClose: () => void;
}

export function RoomForm({ open, room, onSave, onClose }: RoomFormProps) {
  const [formData, setFormData] = useState<Room>({
    id: "",
    number: "",
    floor: 1,
    building: "A",
    capacity: 1,
    type: "single",
    pricePerMonth: 500000,
    status: "available",
    amenities: [],
  });

  useEffect(() => {
    if (open) {
      if (room) {
        setFormData(room);
      } else {
        const settings = getSettings(defaultSettings);
        setFormData({
          id: "",
          number: "",
          floor: 1,
          building: "A",
          capacity: 1,
          type: "single",
          pricePerMonth: settings.defaultPrice,
          status: "available",
          amenities: [],
        });
      }
    }
  }, [open, room]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id) {
      formData.id = `room-${Date.now()}`;
    }
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {room ? "Xonani tahrirlash" : "Yangi xona qo'shish"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Xona raqami
              </label>
              <Input
                value={formData.number}
                onChange={(e) =>
                  setFormData({ ...formData, number: e.target.value })
                }
                placeholder="101"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bino
              </label>
              <Select
                value={formData.building}
                onValueChange={(value) =>
                  setFormData({ ...formData, building: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BUILDINGS.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Qavat
              </label>
              <Select
                value={formData.floor.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, floor: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FLOORS.map((f) => (
                    <SelectItem key={f} value={f.toString()}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sig\'imi
              </label>
              <Select
                value={formData.capacity.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, capacity: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 o'rinli</SelectItem>
                  <SelectItem value="2">2 o'rinli</SelectItem>
                  <SelectItem value="3">3 o'rinli</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Turi
              </label>
              <Select
                value={formData.type}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Bitta o'rinli</SelectItem>
                  <SelectItem value="double">Ikki o'rinli</SelectItem>
                  <SelectItem value="triple">Uch o'rinli</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Oylik narxi
              </label>
              <Input
                type="number"
                value={formData.pricePerMonth}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pricePerMonth: parseInt(e.target.value),
                  })
                }
                placeholder="500000"
              />
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
                  <SelectItem value="available">Mavjud</SelectItem>
                  <SelectItem value="occupied">Band</SelectItem>
                  <SelectItem value="maintenance">Remontda</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Qulayliklar
            </label>
            <div className="grid grid-cols-2 gap-3">
              {AMENITIES.map((amenity) => (
                <label
                  key={amenity}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={formData.amenities.includes(amenity)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData({
                          ...formData,
                          amenities: [...formData.amenities, amenity],
                        });
                      } else {
                        setFormData({
                          ...formData,
                          amenities: formData.amenities.filter(
                            (a) => a !== amenity,
                          ),
                        });
                      }
                    }}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {amenity}
                  </span>
                </label>
              ))}
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
