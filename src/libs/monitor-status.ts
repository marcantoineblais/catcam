import { Monitor } from "../models/monitor";

export function isMonitorOnline(monitor: Monitor | null) {
  if (!monitor) return true;
  return monitor.mode === "start";
}

export function updateMonitorsStatus(isOn: boolean) {
  if (isOn) return "start";
  return "stop";
}
