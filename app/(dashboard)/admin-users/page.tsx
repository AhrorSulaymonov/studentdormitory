"use client";

import { useState, useEffect } from "react";
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

    const newAdmin: AdminUser = {
      id: `admin-${Date.now()}`,
      username: newUsername,
      password: newPassword,
      fullName: newFullName,
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
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin foydalanuvchilar
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Jami adminlar: {admins.length}
          </p>
        </div>
        <Button onClick={() => setOpenForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Yangi admin
        </Button>
      </div>

      {/* Admins List */}
      <div className="space-y-3">
        {admins.map((admin) => (
          <Card key={admin.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {admin.username === MASTER_ADMIN.username && (
                    <Shield className="w-5 h-5 text-yellow-600" />
                  )}
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {admin.fullName}
                  </h3>
                  {admin.username === MASTER_ADMIN.username && (
                    <span className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-100 rounded">
                      Master admin
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
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
                    className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                    onClick={() => setDeleteId(admin.id)}
                  >
                    <Trash2 className="w-4 h-4" />
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yangi admin qo&apos;shish</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                To&apos;liq ismi
              </label>
              <Input
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                placeholder="Ism Familya"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Foydalanuvchi nomi
              </label>
              <Input
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Parol
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenForm(false)}
              >
                Bekor qilish
              </Button>
              <Button type="submit">Qo&apos;shish</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
