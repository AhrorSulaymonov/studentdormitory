export const MASTER_ADMIN = {
  username: "adminadmin",
  password: "adminadmin",
  fullName: "Master Administrator",
};

export const UZBEK_TRANSLATIONS = {
  // General
  dashboard: "Bosh sahifa",
  rooms: "Xonalar",
  students: "Talabalar",
  payments: "To'lovlar",
  roomAllocation: "Xona joylashtirish",
  adminUsers: "Admin foydalanuvchilar",
  settings: "Sozlamalar",
  logout: "Chiqish",
  login: "Kirish",
  username: "Foydalanuvchi nomi",
  password: "Parol",
  search: "Qidirish",
  filter: "Saralash",
  add: "Qo'shish",
  edit: "Tahrirlash",
  delete: "o'chirish",
  save: "Saqlash",
  cancel: "Bekor qilish",
  confirm: "Tasdiqlash",
  close: "Yopish",

  // Room
  roomNumber: "Xona raqami",
  floor: "Qavat",
  building: "Bino",
  capacity: "Sig'imi",
  type: "Turi",
  pricePerMonth: "Oylik narxi",
  status: "Holati",
  amenities: "Qulayliklar",
  single: "Bitta o'rinli",
  double: "Ikki o'rinli",
  triple: "Uch o'rinli",
  available: "Mavjud",
  occupied: "Band",
  maintenance: "Remontda",

  // Student
  fullName: "To'liq ismi",
  studentId: "Talaba ID",
  faculty: "Fakultet",
  year: "Kurs",
  phone: "Telefon",
  email: "Email",
  roomId: "Xona",
  checkInDate: "Kirib kelgan sana",
  checkOutDate: "Chiqib ketgan sana",
  photoUrl: "Surati",
  active: "Faol",
  inactive: "Faol emas",
  graduated: "Bitirdi",

  // Payment
  amount: "Miqdori",
  month: "Oy",
  dueDate: "To'lov muddati",
  paidDate: "To'lov sanasi",
  paid: "To'landi",
  unpaid: "To'lanmadi",
  partial: "Qisman",
  overdue: "Muddati o'tgan",
  method: "Usuli",
  cash: "Naqd",
  transfer: "o'tkazma",
  card: "Karta",
  other: "Boshqa",
  notes: "Izohlar",

  // Settings
  dormName: "Turar joy nomi",
  defaultPrice: "Standart narxi",
  dueDay: "To'lov kuni",
  currency: "Valyuta",
  importData: "Ma'lumotlarni import qilish",
  exportData: "Ma'lumotlarni eksport qilish",
  resetData: "Ma'lumotlarni qayta tiklash",

  // Messages
  addedSuccessfully: "Muvaffaqiyatli qo'shildi",
  updatedSuccessfully: "Muvaffaqiyatli yangilandi",
  deletedSuccessfully: "Muvaffaqiyatli o'chirildi",
  deleteConfirm: "Rostdan ham o'chirmoqchisiz?",
  invalidCredentials: "Noto'g'ri foydalanuvchi nomi yoki parol",
  loginRequired: "Kirish talab qilindi",
};

export const STATUS_COLORS = {
  available: "bg-green-100 text-green-800",
  occupied: "bg-blue-100 text-blue-800",
  maintenance: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  unpaid: "bg-red-100 text-red-800",
  partial: "bg-yellow-100 text-yellow-800",
  overdue: "bg-red-100 text-red-800",
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  graduated: "bg-gray-100 text-gray-800",
};

export const FACULTIES = [
  "Informatika",
  "Kimyo",
  "Fizika",
  "Matematika",
  "Biologiya",
  "Boshkaruv",
  "Iqtisodiyot",
  "Xorijiy tillar",
];

export const AMENITIES = [
  "WiFi",
  "Konditsioner",
  "Mushuklash maskani",
  "Idish-osh jihozlari",
  "Taslama",
  "Xarita",
  "Telefon",
  "TV",
];

export const BUILDINGS = ["A", "B", "C"];
export const FLOORS = [1, 2, 3];

export const formatDate = (date: string | Date): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
};

export const formatCurrency = (
  amount: number,
  currency: string = "UZS",
): string => {
  return new Intl.NumberFormat("uz-UZ", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

export const getMonthName = (monthString: string): string => {
  const [year, month] = monthString.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return new Intl.DateTimeFormat("uz-UZ", {
    year: "numeric",
    month: "long",
  }).format(date);
};
