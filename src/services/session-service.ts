import { getToken } from "../libs/jwt";
import { SettingsService } from "./settings-service";
import { ShinobiService } from "./shinobi-service";

export class SessionService {
  static async getSession() {
    const token = await getToken({ isServerAction: true });
    const authToken = token?.authToken;
    const groupKey = token?.groupKey;
    const email = token?.email;
    const permissions = token?.permissions ?? null;

    const monitors = await ShinobiService.getMonitors({ authToken, groupKey });
    const videos = await ShinobiService.getVideos({ authToken, groupKey });
    const settings = await SettingsService.getSettings(email);
    return {
      authToken,
      groupKey,
      permissions,
      monitors,
      videos,
      settings,
    };
  }
}
