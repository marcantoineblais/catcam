import { TZDate } from "@date-fns/tz";

export interface Video {
  title?: string;
  src: string;
  mid: string;
  thumbnail?: string;
  timestamp?: Date | TZDate;
  isLiveStream?: boolean;
  isStreamOnline?: boolean;
}
