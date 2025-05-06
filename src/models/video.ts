import { TZDate } from "@date-fns/tz";

export interface Video {
  src: string;
  thumbnail: string;
  timestamp: Date | TZDate;
}
