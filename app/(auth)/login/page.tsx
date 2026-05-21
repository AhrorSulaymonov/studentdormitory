"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(username, password);
      router.push("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Xato",
        description: "Noto'g'ri foydalanuvchi nomi yoki parol",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-3 sm:p-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-900">
              Turar joy
            </h1>
            <p className="text-center text-sm sm:text-base text-gray-600 mt-1 md:mt-2">
              Boshqaruv tizimi
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                Foydalanuvchi nomi
              </label>
              <Input
                type="text"
                placeholder="adminadmin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="text-sm"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                Parol
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="text-sm"
              />
            </div>

            <Button
              type="submit"
              className="w-full text-sm sm:text-base"
              disabled={loading || !username || !password}
            >
              {loading ? "Yuklanmoqda..." : "Kirish"}
            </Button>
          </form>

          <div className="mt-4 md:mt-6 p-2 sm:p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-gray-600 text-center">
              <strong>Test hisobi:</strong>
              <br />
              Foydalanuvchi:{" "}
              <code className="bg-white px-1 sm:px-2 py-1 rounded text-xs">
                adminadmin
              </code>
              <br />
              Parol:{" "}
              <code className="bg-white px-1 sm:px-2 py-1 rounded text-xs">
                adminadmin
              </code>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
