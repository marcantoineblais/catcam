import { format } from "date-fns";

export function getTime(date: Date) {
  return format(date, "HH:mm");
}

export function getFullDate(date: Date) {
  return format(date, "yyyy-mm-dd");
}

export function getDateTime(date: Date) {
  return format(date, "yyyy-mm-dd'T'HH:mm:ss'Z'");
}

export function getFormattedDate(date: Date) {
  return format(date, "mm-dd-yyyy");
}

export function getFormattedTime(date: Date) {
  return format(date, "HH:mm:ss");
}
