import path from "path";
import fs from "fs";
import { DEFAULT_SETTINGS } from "../config";

const SETTINGS_DIR =
  process.env.USER_SETTINGS_PATH || path.join(process.cwd(), "user-settings");

export class SettingsService {
  static async getSettings(email?: string) {
    if (!email) {
      return DEFAULT_SETTINGS;
    }

    return await this.readSettings(email);
  }

  static async readSettings(email: string) {
    if (!email) {
      throw new Error("Email is required to read settings");
    }

    try {
      const settingsPath = path.join(SETTINGS_DIR, `${email}.json`);
      const data = await fs.promises.readFile(settingsPath, {
        encoding: "utf-8",
      });
      return JSON.parse(data);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        // File does not exist, return default settings
        return {
          ...DEFAULT_SETTINGS,
          updatedAt: null,
        };
      }
      console.error("Error reading settings:", error);
      throw error;
    }
  }

  static async writeSettings({
    home,
    camera,
    quality,
    mode,
    email,
  }: {
    home: string;
    camera: string;
    quality: string;
    mode: string;
    email: string;
  }) {
    if (!email) {
      throw new Error("Email is required to save settings");
    }

    const settings = {
      home: typeof home === "string" ? home : "",
      camera: typeof camera === "string" ? camera : "",
      quality: typeof quality === "string" ? quality : "high",
      mode: typeof mode === "string" ? mode : "light",
      updatedAt: new Date().toISOString(),
    };

    const settingsPath = path.join(SETTINGS_DIR, `${email}.json`);
    await fs.promises.mkdir(SETTINGS_DIR, { recursive: true });
    await fs.promises.writeFile(
      settingsPath,
      JSON.stringify(settings, null, 2),
      {
        encoding: "utf-8",
      },
    );

    return settings;
  }
}
