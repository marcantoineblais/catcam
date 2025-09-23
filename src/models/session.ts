import { Monitor } from "./monitor";
import { Settings } from "./settings";
import { Video } from "./video";

export interface Session {
  authToken: string | null;
  groupKey: string | null;
  videos: Video[];
  monitors: Monitor[];
  settings: Settings;
}
