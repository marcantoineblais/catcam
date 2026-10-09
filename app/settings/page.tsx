"use client";

import { useEffect, useMemo, useState } from "react";

import Container from "@/components/Container";
import Modal from "@/components/modal/Modal";
import { useModal } from "@/components/modal/useModal";
import Button from "@/components/ui/Button";
import OnOffSwitch from "@/components/ui/OnOffSwitch";
import { useSession } from "@/hooks/useSession";
import { isMonitorOnline, updateMonitorsStatus } from "@/libs/monitor-status";
import { Monitor } from "@/models/monitor";
import { ErrorMessage } from "@/types/types";

import SelectInput from "../../components/ui/SelectInput";

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
  const areAllMonitorsOn = useMemo(
    () => monitors.every((monitor) => isMonitorOnline(monitor)),
    [monitors],
  );
  const someSwitchesDisabled = useMemo(
    () => switchesDisabled.some((disabled) => disabled),
    [switchesDisabled],
  );

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

  async function toggleAllMonitors(isOn: boolean) {
    if (monitors.every((monitor) => isMonitorOnline(monitor) === isOn)) return;
    await Promise.all(monitors.map((monitor) => toggleMonitor(monitor, isOn)));
  }

  return (
    <>
      <Container className="flex flex-col gap-6">
        <div className="px-1">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Settings
          </h1>
          <p className="mt-1 text-sm text-muted">
            Personalize how Catcam looks and behaves.
          </p>
        </div>

        <section className="card p-5 md:p-6">
          <div className="mb-5">
            <p className="eyebrow">Preferences</p>
            <h2 className="mt-0.5 text-lg font-semibold tracking-tight">
              Display &amp; playback
            </h2>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
            <SelectInput
              label="Appearance"
              value={formData.mode}
              onChange={(value) => handleChange("mode", value)}
              options={[
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
                { value: "auto", label: "Auto" },
              ]}
            />

            <SelectInput
              label="Home page"
              value={formData.home}
              onChange={(value) => handleChange("home", value)}
              options={[
                { value: "/live", label: "Livestream" },
                { value: "/recordings", label: "Recordings" },
              ]}
            />

            <SelectInput
              label="Default camera"
              value={formData.camera}
              onChange={(value) => handleChange("camera", value)}
              options={monitors.map((monitor) => {
                return { label: monitor.name, value: monitor.id };
              })}
            />

            <SelectInput
              label="Default quality"
              value={formData.quality}
              onChange={(value) => handleChange("quality", value)}
              options={[
                { label: "High", value: "HQ" },
                { label: "Low", value: "SQ" },
              ]}
            />
          </form>
        </section>

        {isAdmin && (
          <section className="card p-5 md:p-6">
            <div className="mb-4">
              <p className="eyebrow">Admin</p>
              <h2 className="mt-0.5 text-lg font-semibold tracking-tight">
                Monitors
              </h2>
            </div>

            <div className="w-full flex flex-col divide-y divide-border">
              <div className="w-full py-3 flex justify-between items-center gap-6">
                <div className="grow min-w-0">
                  <div className="text-sm font-semibold">All monitors</div>
                  <div className="text-xs text-muted">
                    {areAllMonitorsOn
                      ? "All cameras are on"
                      : "Some cameras are off"}
                  </div>
                </div>
                <OnOffSwitch
                  isOn={areAllMonitorsOn}
                  aria-label="Toggle all monitors"
                  onClick={() => toggleAllMonitors(!areAllMonitorsOn)}
                  disabled={someSwitchesDisabled}
                />
              </div>
              {monitors.map((monitor, i) => {
                const isDisabled = switchesDisabled[i];
                const isOn = isMonitorOnline(monitor);

                return (
                  <div
                    className="w-full py-3 flex justify-between items-center gap-6"
                    key={monitor.id}
                  >
                    <div className="grow min-w-0 flex items-center gap-3">
                      <span
                        data-on={isOn || undefined}
                        className="size-2 shrink-0 rounded-full bg-text/25 data-on:bg-success data-on:shadow-[0_0_0_3px_var(--color-success-soft)]"
                      />
                      <span className="text-sm truncate">{monitor.name}</span>
                    </div>
                    <OnOffSwitch
                      isOn={isMonitorOnline(monitor)}
                      aria-label={`Toggle ${monitor.name}`}
                      onClick={() => toggleMonitor(monitor, !isOn)}
                      disabled={isDisabled}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </Container>

      <Modal
        header={error?.error}
        isOpen={isOpen}
        onClose={onClose}
        onUnmount={() => setError(null)}
        footer={
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        }
      >
        {error?.message}
      </Modal>
    </>
  );
}
