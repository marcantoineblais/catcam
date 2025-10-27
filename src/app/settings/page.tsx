"use client";

import { useEffect, useMemo, useState } from "react";
import FormSelect from "./FormSelect";
import Logo from "@/src/components/Logo";
import { useModal } from "@/src/hooks/useModal";
import OnOffSwitch from "@/src/components/OnOffSwitch";
import { Monitor } from "@/src/models/monitor";
import {
  isMonitorOnline,
  updateMonitorsStatus,
} from "@/src/libs/monitor-status";
import { useSession } from "@/src/hooks/useSession";

export default function Settings() {
  const {
    session: { settings, monitors, permissions },
    updateSession,
  } = useSession();
  const { openModal } = useModal();
  const [formData, setFormData] = useState(settings);
  const [switchesDisabled, setSwitchesDisabled] = useState(
    monitors.map(() => false)
  );
  const isAdmin = useMemo(() => permissions === "all", [permissions]);

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
          openModal({
            modalTitle: "Error",
            modalContent: (
              <p>Could not update your settings. Please try again later.</p>
            ),
          });
          throw new Error(response.statusText);
        }
      } catch (error) {
        openModal({
          modalTitle: "Error",
          modalContent: (
            <p>Could not update your settings. Please try again later.</p>
          ),
        });
        console.error("[Settings] Error saving settings:", error);
      }
    };

    saveChanges();
  }, [formData, updateSession, settings, openModal]);

  function handleChange(name: string, value: string) {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function toggleMonitor(monitor: Monitor, isOn: boolean) {
    if (isMonitorOnline(monitor) === isOn) return;

    setSwitchesDisabled((prev) =>
      prev.map((p, index) => (monitors[index].id === monitor.id ? true : p))
    );
    const updatedStatus = {
      monitorId: monitor.id,
      monitorMode: updateMonitorsStatus(isOn),
    };

    try {
      const response = await fetch(`/api/settings/monitors/change-mode`, {
        method: "POST",
        body: JSON.stringify(updatedStatus),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      if (!data.ok) {
        throw new Error("Failed to update monitor status");
      }

      updateSession((prev) => {
        const monitors = prev.monitors.map((m) => {
          if (m.id === monitor.id) {
            return { ...m, mode: updateMonitorsStatus(isOn) };
          }
          return m;
        });

        return { monitors };
      });
    } catch (error) {
      console.error("[Settings] Error updating monitor status:", error);
    }
    setSwitchesDisabled((prev) =>
      prev.map((p, index) => (monitors[index].id === monitor.id ? false : p))
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <main className="z-10 h-full pt-3 p-1 container mx-auto max-w-(--breakpoint-lg) overflow-y-auto">
        <form className="w-full px-3 py-6 shadow bg-gray-50 rounded dark:bg-zinc-700 dark:shadow-zinc-50/10">
          <h1 className="w-full pb-3 text-center text-3xl">Settings</h1>

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
            options={monitors.map((monitor) => {
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

        {isAdmin && (
          <div className="w-full mt-3 px-3 py-6 shadow bg-gray-50 rounded dark:bg-zinc-700 dark:shadow-zinc-50/10">
            <h2 className="w-full pb-3 text-center text-3xl">Monitors</h2>
            <div className="w-full md:w-fit flex flex-col items-start gap-3">
              {monitors.map((monitor, i) => {
                const isDisabled = switchesDisabled[i];
                const isOn = isMonitorOnline(monitor);

                return (
                  <div
                    className="w-full flex justify-between items-center gap-10"
                    key={monitor.id}
                  >
                    <div className="grow text-sm">{monitor.name}</div>
                    <OnOffSwitch
                      isOn={isMonitorOnline(monitor)}
                      onClick={() => toggleMonitor(monitor, !isOn)}
                      disabled={isDisabled}
                      width={72}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <Logo className="fixed -bottom-7 text-gray-950 dark:text-zinc-200 translate-y-1/2 scale-125 landscape:hidden lg:landscape:block" />
    </div>
  );
}
