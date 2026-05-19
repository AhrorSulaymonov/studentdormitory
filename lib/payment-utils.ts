export interface PaymentMonth {
  month: number; // 1-12
  year: number;
  status: "paid" | "unpaid" | "upcoming";
  isCurrent: boolean;
  isCheckoutMonth: boolean;
  label: string; // "Yanvar 2025" kabi
}

const UZ_MONTHS = [
  "Yanvar",
  "Fevral",
  "Mart",
  "Aprel",
  "May",
  "Iyun",
  "Iyul",
  "Avgust",
  "Sentabr",
  "Oktabr",
  "Noyabr",
  "Dekabr",
];

/**
 * Talaba uchun barcha to'lov oylarini yaratadi
 *
 * Qoidalar:
 * - Har oy uchun BITTA to'lov yozuvi bo'ladi
 * - O'quv yili: kirish oyidan iyun oyigacha (6-oy)
 * - Agar chiqish oyi bo'lsa, o'sha oy ham kiritiladi
 * - Chiqish oyidan KEYIN hisob-kitob qilinmaydi
 *
 * Statusi:
 * - O'tgan oylar: "paid" yoki "unpaid"
 * - Joriy oy: "paid" yoki "unpaid" (isCurrent: true)
 * - Kelasi oylar: "upcoming"
 */
export function generatePaymentMonths(
  checkInDate: Date,
  checkOutDate: Date | null,
  paidMonths: string[], // ["2025-01", "2025-03"] formatda
  currentDate: Date,
): PaymentMonth[] {
  const checkInMonth = checkInDate.getMonth() + 1; // 1-12
  const checkInYear = checkInDate.getFullYear();

  const checkOutMonth = checkOutDate ? checkOutDate.getMonth() + 1 : null;
  const checkOutYear = checkOutDate ? checkOutDate.getFullYear() : null;

  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  // Oxirgi oyni aniqlash
  let endMonth: number;
  let endYear: number;

  if (checkOutDate) {
    // Chiqish sanasi berilgan bo'lsa, o'sha oy oxirigacha
    endMonth = checkOutMonth!;
    endYear = checkOutYear!;
  } else {
    // Chiqish sanasi yo'q bo'lsa, iyun (6-oy) gacha
    endMonth = 6; // Iyun

    // Agar kirish sentabr-dekabr (7-12) bo'lsa, keyingi yilning iyunigacha
    // Agar kirish yanvar-iyun (1-6) bo'lsa, shu yilning iyunigacha
    if (checkInMonth >= 7) {
      endYear = checkInYear + 1;
    } else {
      endYear = checkInYear;
    }
  }

  const result: PaymentMonth[] = [];

  let currentIterMonth = checkInMonth;
  let currentIterYear = checkInYear;

  // Barcha oylarni ko'rib chiqish
  while (true) {
    const monthKey = `${currentIterYear}-${String(currentIterMonth).padStart(2, "0")}`;
    const isPaid = paidMonths.includes(monthKey);
    const isCurrent =
      currentIterMonth === currentMonth && currentIterYear === currentYear;
    const isCheckout =
      currentIterMonth === endMonth && currentIterYear === endYear;

    let status: "paid" | "unpaid" | "upcoming";

    // O'tgan oylar
    if (
      currentIterYear < currentYear ||
      (currentIterYear === currentYear && currentIterMonth < currentMonth)
    ) {
      status = isPaid ? "paid" : "unpaid";
    }
    // Joriy oy
    else if (isCurrent) {
      status = isPaid ? "paid" : "unpaid";
    }
    // Kelasi oylar
    else {
      status = "upcoming";
    }

    result.push({
      month: currentIterMonth,
      year: currentIterYear,
      status,
      isCurrent,
      isCheckoutMonth: isCheckout,
      label: `${UZ_MONTHS[currentIterMonth - 1]} ${currentIterYear}`,
    });

    // Oxirgi oyga yetgandimi?
    if (currentIterMonth === endMonth && currentIterYear === endYear) {
      break;
    }

    // Keyingi oyga o'tish
    currentIterMonth++;
    if (currentIterMonth > 12) {
      currentIterMonth = 1;
      currentIterYear++;
    }
  }

  return result;
}

/**
 * Talaba uchun jami to'lov miqdorini hisoblash
 * Jami oylar soniga standart narxni ko'paytiradi
 */
export function calculateTotalDue(
  checkInDate: Date,
  checkOutDate: Date | null,
  pricePerMonth: number,
): number {
  const months = generatePaymentMonths(
    checkInDate,
    checkOutDate,
    [],
    new Date(),
  );
  return months.length * pricePerMonth;
}

/**
 * Talaba uchun to'langan summani hisoblash
 */
export function calculatePaidAmount(
  payments: Array<{ status: string; amount: number }>,
): number {
  return payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);
}

/**
 * Talaba uchun to'lanmagan summani hisoblash
 */
export function calculateUnpaidAmount(
  payments: Array<{ status: string; amount: number }>,
): number {
  return payments
    .filter(
      (p) =>
        p.status === "unpaid" ||
        p.status === "overdue" ||
        p.status === "partial",
    )
    .reduce((sum, p) => sum + p.amount, 0);
}

/**
 * Muddati o'tgan to'lovlarni topish
 */
export function getOverduePayments(
  checkInDate: Date,
  checkOutDate: Date | null,
  paidMonths: string[],
  currentDate: Date,
): PaymentMonth[] {
  const months = generatePaymentMonths(
    checkInDate,
    checkOutDate,
    paidMonths,
    currentDate,
  );
  return months.filter(
    (m) => !m.isCurrent && !m.isCheckoutMonth && m.status === "unpaid",
  );
}

/**
 * Joriy oy to'lovini topish
 */
export function getCurrentMonthPayment(
  checkInDate: Date,
  checkOutDate: Date | null,
  paidMonths: string[],
  currentDate: Date,
): PaymentMonth | null {
  const months = generatePaymentMonths(
    checkInDate,
    checkOutDate,
    paidMonths,
    currentDate,
  );
  return months.find((m) => m.isCurrent) || null;
}
