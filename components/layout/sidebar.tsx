"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  DoorOpen,
  Users,
  Receipt,
  LayoutGrid,
  UserCog,
  Settings,
} from "lucide-react";

const navItems = [
  {
    label: "Bosh sahifa",
    href: "/",
    icon: BarChart3,
  },
  {
    label: "Xonalar",
    href: "/rooms",
    icon: DoorOpen,
  },
  {
    label: "Talabalar",
    href: "/students",
    icon: Users,
  },
  {
    label: "To'lovlar",
    href: "/payments",
    icon: Receipt,
  },
  {
    label: "Joylashtirish",
    href: "/room-allocation",
    icon: LayoutGrid,
  },
  {
    label: "Admin foydalanuvchilar",
    href: "/admin-users",
    icon: UserCog,
  },
  {
    label: "Sozlamalar",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white dark:bg-slate-950 border-r border-gray-200 dark:border-slate-800 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Turar joy
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Boshqaruv tizimi
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800",
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
