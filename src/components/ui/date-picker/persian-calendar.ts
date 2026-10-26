const formatter = new Intl.DateTimeFormat("en-US-u-ca-persian", { year: "numeric", month: "numeric", day: "numeric", timeZone: "UTC" });
export function persianParts(date: Date) {
  const parts = formatter.formatToParts(date);
  const part = (type: string) => Number(parts.find((item) => item.type === type)?.value);
  return { year: part("year"), month: part("month"), day: part("day") };
}
export function persianToDate(year: number, month: number, day: number) {
  const target = year * 10000 + month * 100 + day;
  let low = Math.floor(Date.UTC(year + 621, 0, 1) / 86400000);
  let high = Math.floor(Date.UTC(year + 622, 11, 31) / 86400000);
  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    const date = new Date(middle * 86400000);
    const parts = persianParts(date);
    const value = parts.year * 10000 + parts.month * 100 + parts.day;
    if (value === target) return date;
    if (value < target) low = middle + 1;
    else high = middle - 1;
  }
  throw new Error("Invalid Persian date");
}
export function persianMonthDays(year: number, month: number) {
  if (month <= 6) return 31;
  if (month <= 11) return 30;
  return Math.round((persianToDate(year + 1, 1, 1).getTime() - persianToDate(year, 12, 1).getTime()) / 86400000);
}
export const persianMonths = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
