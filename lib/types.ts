export type UserRole = "admin";
export type RoomType = "single" | "double" | "triple";
export type RoomStatus = "available" | "occupied" | "maintenance";
export type StudentStatus = "active" | "inactive" | "graduated";
export type PaymentStatus = "paid" | "unpaid" | "partial" | "overdue";
export type PaymentMethod = "cash" | "transfer" | "card" | "other";

export interface User {
  username: string;
  role: UserRole;
  loginTime: string;
}

export interface AdminUser {
  id: string;
  username: string;
  password: string;
  fullName: string;
  createdAt: string;
}

export interface Room {
  id: string;
  number: string;
  floor: number;
  building: string;
  capacity: number;
  type: RoomType;
  pricePerMonth: number;
  status: RoomStatus;
  amenities: string[];
  currentOccupants?: number;
}

export interface Student {
  id: string;
  fullName: string;
  studentId: string;
  faculty: string;
  year: number;
  phone: string;
  email: string;
  roomId: string | null;
  checkInDate: string | null;
  checkOutDate: string | null;
  status: StudentStatus;
  photoUrl: string;
}

export interface Payment {
  id: string;
  studentId: string;
  roomId: string;
  amount: number;
  month: string; // YYYY-MM format
  dueDate: string; // ISO date
  paidDate: string | null; // ISO date
  status: PaymentStatus;
  method: PaymentMethod | null;
  notes: string;
}

export interface DormSettings {
  dormName: string;
  defaultPrice: number;
  dueDay: number;
  currency: string;
}

export interface AppData {
  rooms: Record<string, Room>;
  students: Record<string, Student>;
  payments: Record<string, Payment>;
  admins: Record<string, AdminUser>;
  settings: DormSettings;
}
