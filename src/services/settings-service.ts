import crypto from "crypto";
import fs from "fs";
import path from "path";
import { DEFAULT_SETTINGS } from "../config";

const SETTINGS_DIR =
  process.env.USER_SETTINGS_PATH || path.join(process.cwd(), "user-settings");

/** Predictable, filesystem-safe filename from email (same input → same hash). */
function safeFilename(email: string): string {
  return crypto
    .createHash("sha256")
    .update(email.trim().toLowerCase())
    .digest("hex");
}

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
      const filename = safeFilename(email);
      const settingsPath = path.join(SETTINGS_DIR, `${filename}.json`);
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
      quality: typeof quality === "string" ? quality : "HQ",
      mode: typeof mode === "string" ? mode : "light",
      updatedAt: new Date().toISOString(),
    };

    const filename = safeFilename(email);
    const settingsPath = path.join(SETTINGS_DIR, `${filename}.json`);
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
