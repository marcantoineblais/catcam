"use client";

import { useEffect, useState } from "react";
import renderPopup from "@/src/utils/renderPopup";
import FormSelect from "./FormSelect";
import { useSession } from "@/src/hooks/useSession";
import Logo from "@/src/components/Logo";

export default function Settings() {
  const {
    session: { settings, monitors },
    updateSession,
  } = useSession();
  const [formData, setFormData] = useState(settings);

  useEffect(() => {
    if (
      settings.mode === formData.mode &&
      settings.home === formData.home &&
      settings.camera === formData.camera &&
      settings.quality === formData.quality
    ) {
      return;
    }

    const saveChanges = async () => {
      try {
        const response = await fetch("/api/settings/save", {
          method: "POST",
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          updateSession({ settings: formData });
        } else {
          renderPopup([
            "Could not update your settings.",
            "Please try again later.",
          ]);
          throw new Error(response.statusText);
        }
      } catch (error) {
        renderPopup([
          "Could not update your settings.",
          "Please try again later.",
        ]);
        console.error("[Settings] Error saving settings:", error);
      }
    };

    saveChanges();
  }, [formData, updateSession, settings]);

  function handleChange(name: string, value: string) {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <main className="h-full pt-3 p-1 container mx-auto max-w-(--breakpoint-lg) overflow-hidden">
        <form className="grow w-full px-3 py-6 shadow bg-gray-50 rounded dark:bg-zinc-700 dark:shadow-zinc-50/10 overflow-auto">
          <h1 className="w-full pb-10 text-center text-3xl">Settings</h1>

          <FormSelect
            label="Appearance"
            name="mode"
            value={formData.mode}
            onChange={(e) => handleChange("mode", e.target.value)}
            options={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
              { value: "auto", label: "Auto" },
            ]}
          />

          <FormSelect
            label="Home page"
            name="home"
            value={formData.home}
            onChange={(e) => handleChange("home", e.target.value)}
            options={[
              { value: "/live", label: "Livestream" },
              { value: "/recordings", label: "Recordings" },
            ]}
          />

          <FormSelect
            label="Default camera"
            name="camera"
            value={formData.camera}
            onChange={(e) => handleChange("camera", e.target.value)}
            options={monitors?.map((monitor) => {
              return { label: monitor.name, value: monitor.id };
            })}
          />

          <FormSelect
            label="Default quality"
            name="quality"
            value={formData.quality}
            onChange={(e) => handleChange("quality", e.target.value)}
            options={[
              { label: "High", value: "HQ" },
              { label: "Low", value: "SQ" },
            ]}
          />
        </form>
      </main>

      <Logo className="text-gray-950 dark:text-zinc-200 translate-y-1/2 scale-150 landscape:hidden lg:landscape:block" />
    </div>
  );
}
