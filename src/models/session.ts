import { Monitor } from "./monitor";
import { Settings } from "./settings";
import { Video } from "./video";

export interface Session {
  authToken: string;
  groupKey: string;
  videos: Video[];
  monitors: Monitor[];
  settings: Settings;
}
