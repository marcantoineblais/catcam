import fs from "fs";
import path from "path";
import { DEFAULT_SETTINGS } from "../config";

export async function writeSettings({
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

  try {
    const settings = {
      home: typeof home === "string" ? home : "",
      camera: typeof camera === "string" ? camera : "",
      quality: typeof quality === "string" ? quality : "high",
      mode: typeof mode === "string" ? mode : "auto",
      updatedAt: new Date().toISOString(),
    };

    const dataDir = path.join(process.cwd(), "user-settings");
    const settingsPath = path.join(dataDir, `${email}.json`);
    await fs.promises.mkdir(dataDir, { recursive: true });
    await fs.promises.writeFile(
      settingsPath,
      JSON.stringify(settings, null, 2),
      {
        encoding: "utf-8",
      },
    );

    return settings;
  } catch (error) {
    console.error("Error writing settings:", error);
    throw error;
  }
}

export async function readSettings(email: string) {
  if (!email) {
    throw new Error("Email is required to read settings");
  }

  try {
    const settingsPath = path.join(
      process.cwd(),
      "user-settings",
      `${email}.json`,
    );
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
