"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AdminUser } from "@/lib/types";
import { getAdmins, addAdmin, deleteAdmin } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Trash2, Shield } from "lucide-react";
import { MASTER_ADMIN } from "@/lib/constants";

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = () => {
    const data = getAdmins();
    const adminsArray = Object.values(data);
    setAdmins(
      adminsArray.sort((a) => (a.username === MASTER_ADMIN.username ? -1 : 1)),
    );
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setNewPhotoUrl(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newUsername || !newPassword || !newFullName) {
      toast({
        variant: "destructive",
        title: "Xato",
        description: "Barcha maydonlarni to'ldiring",
      });
      return;
    }

    let photoUrl = newPhotoUrl;
    if (!photoUrl) {
      photoUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${newFullName.replace(/\s+/g, "")}`;
    }

    const newAdmin: AdminUser = {
      id: `admin-${Date.now()}`,
      username: newUsername,
      password: newPassword,
      fullName: newFullName,
      photoUrl: photoUrl,
      createdAt: new Date().toISOString(),
    };

    addAdmin(newAdmin);
    toast({
      title: "Muvaffaqiyat",
      description: "Yangi admin muvaffaqiyatli qo'shildi",
    });

    setNewUsername("");
    setNewPassword("");
    setNewFullName("");
    setNewPhotoUrl("");
    setOpenForm(false);
    loadAdmins();
  };

  const handleDeleteAdmin = (adminId: string) => {
    deleteAdmin(adminId);
    toast({
      title: "Muvaffaqiyat",
      description: "Admin muvaffaqiyatli o'chirildi",
    });
    loadAdmins();
    setDeleteId(null);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 md:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Admin foydalanuvchilar
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 md:mt-2">
            Jami adminlar: {admins.length}
          </p>
        </div>
        <Button
          onClick={() => setOpenForm(true)}
          className="gap-2 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Yangi admin
        </Button>
      </div>

      {/* Admins List */}
      <div className="space-y-2 md:space-y-3">
        {admins.map((admin) => (
          <Card key={admin.id} className="p-2 md:p-4">
            <div className="flex justify-between items-start gap-2 md:gap-4">
              {admin.photoUrl && (
                <Image
                  src={admin.photoUrl}
                  alt={admin.fullName}
                  width={56}
                  height={56}
                  className="w-10 h-10 md:w-14 md:h-14 rounded-lg object-cover shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {admin.username === MASTER_ADMIN.username && (
                    <Shield className="w-4 h-4 md:w-5 md:h-5 text-yellow-600 shrink-0" />
                  )}
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {admin.fullName}
                  </h3>
                  {admin.username === MASTER_ADMIN.username && (
                    <span className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-100 rounded hrink-0">
                      Master admin
                    </span>
                  )}
                </div>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                  Foydalanuvchi:{" "}
                  <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">
                    {admin.username}
                  </code>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Yaratildi:{" "}
                  {new Date(admin.createdAt).toLocaleDateString("uz-UZ")}
                </p>
              </div>

              {admin.username !== MASTER_ADMIN.username && (
                <AlertDialog
                  open={deleteId === admin.id}
                  onOpenChange={(open) => !open && setDeleteId(null)}
                >
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900 shrink-0"
                    onClick={() => setDeleteId(admin.id)}
                  >
                    <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                  </Button>
                  <AlertDialogContent>
                    <AlertDialogTitle>Adminni o&apos;chirish</AlertDialogTitle>
                    <AlertDialogDescription>
                      {admin.fullName}ni admin hisobini o&apos;chirmoqchisiz? Bu
                      amalni qaytarib bo&apos;lmaydi.
                    </AlertDialogDescription>
                    <div className="flex gap-2 justify-end">
                      <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteAdmin(admin.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        O&apos;chirish
                      </AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Add Admin Dialog */}
      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent className="w-full max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">
              Yangi admin qo&apos;shish
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddAdmin} className="space-y-3 md:space-y-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                To&apos;liq ismi
              </label>
              <Input
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                placeholder="Ism Familya"
                className="text-sm"
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Foydalanuvchi nomi
              </label>
              <Input
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="username"
                className="text-sm"
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Parol
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="text-sm"
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 md:mb-3">
                Rasm
              </label>
              <div className="flex flex-col gap-3 md:gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Rasmni tanlang:
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 md:file:mr-4 md:file:py-2 md:file:px-4 file:rounded-md file:border-0 file:text-xs md:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Rasm tanlangan bo&apos;lsa, aks holda avtomatik avatar
                    qo&apos;yiladi
                  </p>
                </div>
                {newPhotoUrl && (
                  <div className="flex flex-col items-center">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      Ko&apos;rin:
                    </p>
                    <Image
                      src={newPhotoUrl}
                      alt="Admin rasmini oldindan ko'rin"
                      width={80}
                      height={80}
                      className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover border border-gray-300 dark:border-gray-600"
                    />
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="flex gap-2 flex-wrap md:flex-nowrap justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpenForm(false);
                  setNewPhotoUrl("");
                }}
                className="text-xs md:text-sm"
              >
                Bekor qilish
              </Button>
              <Button type="submit" className="text-xs md:text-sm">
                Qo&apos;shish
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
