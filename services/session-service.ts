import { getToken } from "../libs/jwt";
import { getSettings } from "./settings-service";
import { getMonitors, getVideos } from "./shinobi-service";

export async function getSession() {
  try {
    const token = await getToken({ isServerAction: true });
    if (!token) {
      return { session: null };
    }

    const authToken = token?.authToken;
    const groupKey = token?.groupKey;
    const email = token?.email;
    const permissions = token?.permissions;

    const [monitors, videos, settings] = await Promise.all([
      getMonitors({ authToken, groupKey }),
      getVideos({ authToken, groupKey }),
      getSettings(email),
    ]);

    return {
      session: {
        authToken,
        groupKey,
        permissions,
        monitors,
        videos,
        settings,
      },
    };
  } catch (error) {
    console.error((error as Error)?.message ?? "Unknown error");
    return { session: null, error: true };
  }
}
