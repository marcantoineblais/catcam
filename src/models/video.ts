import { TZDate } from "@date-fns/tz";

export interface Video {
  src: string;
  mid: string;
  thumbnail: string;
  timestamp: Date | TZDate;
}
