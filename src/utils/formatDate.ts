import { format } from "date-fns";
import { TZDate } from "@date-fns/tz"

export function getTime(date: TZDate | Date) {
  return format(date, "HH:mm");
}

export function getFullDate(date: TZDate | Date) {
  return format(date, "yyyy-MM-dd");
}

export function getDateTimeUrl(date: TZDate | Date) {
  return format(date, "yyyy-MM-dd'T'HH-mm-ss");
}

export function getDateTime(date: TZDate | Date) {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss");
}

export function getFormattedDate(date: TZDate | Date) {
  return format(date, "MM-dd-yyyy");
}

export function getFormattedTime(date: TZDate | Date) {
  return format(date, "HH:mm:ss");
}
