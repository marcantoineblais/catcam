"use client";

import { useEffect, useMemo, useState } from "react";

import Logo from "@/components/Logo";
import Modal from "@/components/modal/Modal";
import { useModal } from "@/components/modal/useModal";
import Button from "@/components/ui/Button";
import OnOffSwitch from "@/components/ui/OnOffSwitch";
import { useSession } from "@/hooks/useSession";
import { isMonitorOnline, updateMonitorsStatus } from "@/libs/monitor-status";
import { Monitor } from "@/models/monitor";
import { ErrorMessage } from "@/types/types";

import FormSelect from "./FormSelect";

export default function Settings() {
  const {
    session: { settings, monitors, permissions },
    updateSession,
  } = useSession();
  const { isOpen, onOpen, onClose } = useModal();
  const [error, setError] = useState<ErrorMessage | null>(null);
  const [formData, setFormData] = useState(settings);
  const [switchesDisabled, setSwitchesDisabled] = useState(
    monitors.map(() => false),
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
          throw new Error(response.statusText);
        }
      } catch (error) {
        console.error("[Settings] Error saving settings:", error);
        setError({
          error: "Error",
          message: "Could not update your settings. Please try again later.",
        });
        onOpen();
      }
    };

    saveChanges();
  }, [formData, updateSession, settings, onOpen]);

  function handleChange(name: string, value: string) {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleClose() {
    onClose(() => setError(null));
  }

  async function toggleMonitor(monitor: Monitor, isOn: boolean) {
    if (isMonitorOnline(monitor) === isOn) return;

    setSwitchesDisabled((prev) =>
      prev.map((p, index) => (monitors[index].id === monitor.id ? true : p)),
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
      prev.map((p, index) => (monitors[index].id === monitor.id ? false : p)),
    );
  }

  return (
    <>
      <div className="h-full overflow-hidden">
        <main className="h-full pt-3 p-1 container mx-auto max-w-lg overflow-y-auto">
          <form className="w-full px-3 py-6 shadow bg-surface-card rounded-lg space-y-4">
            <h1 className="w-full pb-3 text-center text-3xl">Settings</h1>

            <FormSelect
              label="Appearance"
              value={formData.mode}
              onChange={(value) => handleChange("mode", value)}
              options={[
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
                { value: "auto", label: "Auto" },
              ]}
            />

            <FormSelect
              label="Home page"
              value={formData.home}
              onChange={(value) => handleChange("home", value)}
              options={[
                { value: "/live", label: "Livestream" },
                { value: "/recordings", label: "Recordings" },
              ]}
            />

            <FormSelect
              label="Default camera"
              value={formData.camera}
              onChange={(value) => handleChange("camera", value)}
              options={monitors.map((monitor) => {
                return { label: monitor.name, value: monitor.id };
              })}
            />

            <FormSelect
              label="Default quality"
              value={formData.quality}
              onChange={(value) => handleChange("quality", value)}
              options={[
                { label: "High", value: "HQ" },
                { label: "Low", value: "SQ" },
              ]}
            />
          </form>

          {isAdmin && (
            <div className="w-full mt-3 px-3 py-6 shadow bg-surface-card rounded-lg">
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

        <Logo className="fixed -bottom-7 text-text translate-y-1/2 scale-125" />
      </div>

      <Modal
        header={error?.error}
        isOpen={isOpen}
        onClose={onClose}
        footer={
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        }
      >
        {error?.message}
      </Modal>
    </>
  );
}
