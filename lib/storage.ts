import { User, AdminUser, Room, Student, Payment, DormSettings } from "./types";

const STORAGE_KEYS = {
  SESSION: "dorm:session",
  SETTINGS: "dorm:settings",
  ROOMS: "dorm:rooms",
  STUDENTS: "dorm:students",
  PAYMENTS: "dorm:payments",
  ADMINS: "dorm:admins",
  INITIALIZED: "dorm:initialized",
};

// Auth
export const getSession = (): User | null => {
  if (typeof window === "undefined") return null;
  const session = localStorage.getItem(STORAGE_KEYS.SESSION);
  return session ? JSON.parse(session) : null;
};

export const setSession = (user: User): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
};

export const clearSession = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.SESSION);
};

// Settings
export const getSettings = (defaults: DormSettings): DormSettings => {
  if (typeof window === "undefined") return defaults;
  const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return settings ? JSON.parse(settings) : defaults;
};

export const setSettings = (settings: DormSettings): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};

// Rooms
export const getRooms = (): Record<string, Room> => {
  if (typeof window === "undefined") return {};
  const rooms = localStorage.getItem(STORAGE_KEYS.ROOMS);
  return rooms ? JSON.parse(rooms) : {};
};

export const setRooms = (rooms: Record<string, Room>): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
};

export const addRoom = (room: Room): void => {
  const rooms = getRooms();
  rooms[room.id] = room;
  setRooms(rooms);
};

export const updateRoom = (roomId: string, updates: Partial<Room>): void => {
  const rooms = getRooms();
  if (rooms[roomId]) {
    rooms[roomId] = { ...rooms[roomId], ...updates };
    setRooms(rooms);
  }
};

export const deleteRoom = (roomId: string): void => {
  const rooms = getRooms();
  delete rooms[roomId];
  setRooms(rooms);
};

// Students
export const getStudents = (): Record<string, Student> => {
  if (typeof window === "undefined") return {};
  const students = localStorage.getItem(STORAGE_KEYS.STUDENTS);
  return students ? JSON.parse(students) : {};
};

export const setStudents = (students: Record<string, Student>): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
};

export const addStudent = (student: Student): void => {
  const students = getStudents();
  students[student.id] = student;
  setStudents(students);
};

export const updateStudent = (
  studentId: string,
  updates: Partial<Student>,
): void => {
  const students = getStudents();
  if (students[studentId]) {
    students[studentId] = { ...students[studentId], ...updates };
    setStudents(students);
  }
};

export const deleteStudent = (studentId: string): void => {
  const students = getStudents();
  delete students[studentId];
  setStudents(students);
};

// Payments
export const getPayments = (): Record<string, Payment> => {
  if (typeof window === "undefined") return {};
  const payments = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
  return payments ? JSON.parse(payments) : {};
};

export const setPayments = (payments: Record<string, Payment>): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
};

export const addPayment = (payment: Payment): void => {
  const payments = getPayments();
  payments[payment.id] = payment;
  setPayments(payments);
};

export const updatePayment = (
  paymentId: string,
  updates: Partial<Payment>,
): void => {
  const payments = getPayments();
  if (payments[paymentId]) {
    payments[paymentId] = { ...payments[paymentId], ...updates };
    setPayments(payments);
  }
};

export const deletePayment = (paymentId: string): void => {
  const payments = getPayments();
  delete payments[paymentId];
  setPayments(payments);
};

// Admins
export const getAdmins = (): Record<string, AdminUser> => {
  if (typeof window === "undefined") return {};
  const admins = localStorage.getItem(STORAGE_KEYS.ADMINS);
  return admins ? JSON.parse(admins) : {};
};

export const setAdmins = (admins: Record<string, AdminUser>): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(admins));
};

export const addAdmin = (admin: AdminUser): void => {
  const admins = getAdmins();
  admins[admin.id] = admin;
  setAdmins(admins);
};

export const updateAdmin = (
  adminId: string,
  updates: Partial<AdminUser>,
): void => {
  const admins = getAdmins();
  if (admins[adminId]) {
    admins[adminId] = { ...admins[adminId], ...updates };
    setAdmins(admins);
  }
};

export const deleteAdmin = (adminId: string): void => {
  const admins = getAdmins();
  delete admins[adminId];
  setAdmins(admins);
};

// Initialization
export const isInitialized = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEYS.INITIALIZED) === "true";
};

export const setInitialized = (): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, "true");
};

// Data Export/Import
export const exportData = () => {
  if (typeof window === "undefined") return null;
  return {
    rooms: getRooms(),
    students: getStudents(),
    payments: getPayments(),
    admins: getAdmins(),
    settings: getSettings({
      dormName: "Turar joy",
      defaultPrice: 500000,
      dueDay: 10,
      currency: "UZS",
    }),
  };
};

export const importData = (data: any): void => {
  if (typeof window === "undefined") return;
  if (data.rooms) setRooms(data.rooms);
  if (data.students) setStudents(data.students);
  if (data.payments) setPayments(data.payments);
  if (data.admins) setAdmins(data.admins);
  if (data.settings) setSettings(data.settings);
};

export const resetAllData = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.ROOMS);
  localStorage.removeItem(STORAGE_KEYS.STUDENTS);
  localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
  localStorage.removeItem(STORAGE_KEYS.ADMINS);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
};
