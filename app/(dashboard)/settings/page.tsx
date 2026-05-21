"use client";

import { useState, useEffect } from "react";
import { DormSettings } from "@/lib/types";
import {
  getSettings,
  setSettings,
  exportData,
  importData,
  resetAllData,
} from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Download, Upload, Trash2 } from "lucide-react";

const defaultSettings: DormSettings = {
  dormName: "Turar joy",
  defaultPrice: 500000,
  dueDay: 10,
  currency: "UZS",
};

export default function SettingsPage() {
  const [settings, setSettingsState] = useState<DormSettings>(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loaded = getSettings(defaultSettings);
    setSettingsState(loaded);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      setSettings(settings);
      toast({
        title: "Muvaffaqiyat",
        description: "Sozlamalar muvaffaqiyatli saqlandi",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Xato",
        description: "Sozlamalar saqlanishida xato",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    const data = exportData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dorm-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Muvaffaqiyat",
      description: "Ma'lumotlar muvaffaqiyatli eksport qilindi",
    });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        importData(json);
        toast({
          title: "Muvaffaqiyat",
          description: "Ma'lumotlar muvaffaqiyatli import qilindi",
        });
        window.location.reload();
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Xato",
          description: "JSON faylni o'qib bo'lmadi",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    resetAllData();
    toast({
      title: "Muvaffaqiyat",
      description: "Barcha ma'lumotlar qayta tiklanganiga o'xshaydi",
    });
    setResetDialogOpen(false);
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Sozlamalar
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 md:mt-2">
          Dastur sozlamalarini o'zgartirish
        </p>
      </div>

      {/* General Settings */}
      <Card className="p-3 md:p-6">
        <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">
          Umumiy sozlamalar
        </h2>
        <div className="space-y-3 md:space-y-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
              Turar joy nomi
            </label>
            <Input
              value={settings.dormName}
              onChange={(e) =>
                setSettingsState({ ...settings, dormName: e.target.value })
              }
              placeholder="Turar joy nomi"
              className="text-sm"
            />
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
              Standart oylik narxi
            </label>
            <Input
              type="number"
              value={settings.defaultPrice}
              onChange={(e) =>
                setSettingsState({
                  ...settings,
                  defaultPrice: parseInt(e.target.value),
                })
              }
              placeholder="500000"
              className="text-sm"
            />
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
              To'lov muddati (kuni)
            </label>
            <Input
              type="number"
              value={settings.dueDay}
              onChange={(e) =>
                setSettingsState({
                  ...settings,
                  dueDay: parseInt(e.target.value),
                })
              }
              placeholder="10"
              min="1"
              max="31"
              className="text-sm"
            />
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
              Valyuta
            </label>
            <Input
              value={settings.currency}
              onChange={(e) =>
                setSettingsState({ ...settings, currency: e.target.value })
              }
              placeholder="UZS"
              className="text-sm"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full md:w-auto text-sm"
          >
            {saving ? "Saqlanmoqda..." : "Saqlash"}
          </Button>
        </div>
      </Card>

      {/* Data Management */}
      <Card className="p-3 md:p-6">
        <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">
          Ma'lumotlarni boshqarish
        </h2>
        <div className="space-y-2 md:space-y-3">
          <div>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2">
              Barcha ma'lumotlarni JSON faylga eksport qilish
            </p>
            <Button
              onClick={handleExport}
              variant="outline"
              className="gap-2 w-full md:w-auto text-xs md:text-sm"
            >
              <Download className="w-4 h-4" />
              Eksport qilish
            </Button>
          </div>

          <div className="pt-2 md:pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2">
              JSON fayldan ma'lumotlarni import qilish
            </p>
            <label>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <Button
                asChild
                variant="outline"
                className="gap-2 w-full md:w-auto cursor-pointer text-xs md:text-sm"
              >
                <span>
                  <Upload className="w-4 h-4" />
                  Import qilish
                </span>
              </Button>
            </label>
          </div>

          <div className="pt-2 md:pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2">
              Barcha ma'lumotlarni o'chirish va qayta tiklash
            </p>
            <AlertDialog
              open={resetDialogOpen}
              onOpenChange={setResetDialogOpen}
            >
              <Button
                variant="destructive"
                className="gap-2 w-full md:w-auto text-xs md:text-sm"
                onClick={() => setResetDialogOpen(true)}
              >
                <Trash2 className="w-4 h-4" />
                Qayta tiklash
              </Button>
              <AlertDialogContent className="w-full max-w-md">
                <AlertDialogTitle>
                  Barcha ma'lumotlarni qayta tiklash
                </AlertDialogTitle>
                <AlertDialogDescription className="text-xs md:text-sm">
                  Siz barcha ma'lumotlarni o'chirib tashlamoqchisiz? Bu amalni
                  qaytarib bo'lmaydi. Iloji bo'lgan taqdirda avval eksport
                  qiling.
                </AlertDialogDescription>
                <div className="flex gap-2 justify-end flex-wrap">
                  <AlertDialogCancel className="text-xs md:text-sm">
                    Bekor qilish
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleReset}
                    className="bg-red-600 hover:bg-red-700 text-xs md:text-sm"
                  >
                    Rostdan ham qayta tiklash
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </Card>

      {/* Info */}
      <Card className="p-3 md:p-6 bg-blue-50 dark:bg-blue-900">
        <h3 className="text-base md:text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Ma'lumatlar
        </h3>
        <ul className="text-xs md:text-sm text-blue-800 dark:text-blue-100 space-y-1">
          <li>• Barcha ma'lumotlar brauzer localStorage'da saqlanadi</li>
          <li>• Ma'lumotlar faqat shu brauzerda mavjud bo'ladi</li>
          <li>
            • Ko'chib o'tish uchun eksport qiling va boshqa brauzerda import
            qiling
          </li>
          <li>• Qayta tiklash barcha ma'lumotlarni o'chirib tashlaydai</li>
        </ul>
      </Card>
    </div>
  );
}
