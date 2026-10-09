"use client";

import { faClock, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format, startOfDay, subDays, subHours } from "date-fns";
import { useState } from "react";

import Button from "./ui/Button";
import DateTimePicker from "./ui/DateTimePicker";

/** Values use the `datetime-local` input format: "yyyy-MM-ddTHH:mm" */
export type TimeRange = {
  start: string;
  end: string;
};

export const EMPTY_RANGE: TimeRange = { start: "", end: "" };

const toInputValue = (date: Date) => format(date, "yyyy-MM-dd'T'HH:mm");

const PRESETS: { label: string; range: () => TimeRange }[] = [
  {
    label: "Last hour",
    range: () => ({ start: toInputValue(subHours(new Date(), 1)), end: "" }),
  },
  {
    label: "Last 6h",
    range: () => ({ start: toInputValue(subHours(new Date(), 6)), end: "" }),
  },
  {
    label: "Today",
    range: () => ({ start: toInputValue(startOfDay(new Date())), end: "" }),
  },
  {
    label: "Yesterday",
    range: () => {
      const today = startOfDay(new Date());
      return {
        start: toInputValue(subDays(today, 1)),
        end: toInputValue(today),
      };
    },
  },
];

type Props = {
  appliedRange: TimeRange | null;
  onApply: (range: TimeRange) => void;
  onClear: () => void;
};

export default function TimeRangeFilter({
  appliedRange,
  onApply,
  onClear,
}: Props) {
  const [draft, setDraft] = useState<TimeRange>(appliedRange ?? EMPTY_RANGE);
  const [error, setError] = useState<string | null>(null);
  const [openField, setOpenField] = useState<"start" | "end" | null>(null);

  const now = toInputValue(new Date());
  const isActive = appliedRange !== null;
  const hasDraft = Boolean(draft.start || draft.end);

  function apply(range: TimeRange) {
    if (!range.start && !range.end) {
      setError("Pick a start time, an end time, or both.");
      return;
    }
    if (range.start && range.end && range.start >= range.end) {
      setError("The start time must be before the end time.");
      return;
    }

    setError(null);
    setOpenField(null);
    setDraft(range);
    onApply(range);
  }

  function clear() {
    setError(null);
    setOpenField(null);
    setDraft(EMPTY_RANGE);
    onClear();
  }

  return (
    <section className="mt-5 pt-5 border-t border-border">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faClock} className="text-xs text-muted" />
          <p className="eyebrow">Time range</p>
        </div>
        {isActive && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            <span className="size-1.5 rounded-full bg-primary" />
            Active
          </span>
        )}
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => apply(preset.range())}
            className="h-8 px-3 rounded-full text-xs font-medium bg-text/4 ring-1 ring-border cursor-pointer transition-colors duration-200 hover:bg-text/8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 sm:items-start gap-3">
        <DateTimePicker
          label="From"
          value={draft.start}
          max={draft.end || now}
          defaultTime="00:00"
          placeholder="Beginning"
          isOpen={openField === "start"}
          onOpenChange={(open) => setOpenField(open ? "start" : null)}
          onChange={(start) => setDraft((prev) => ({ ...prev, start }))}
        />
        <DateTimePicker
          label="To"
          value={draft.end}
          min={draft.start || undefined}
          max={now}
          defaultTime="23:59"
          placeholder="Now"
          isOpen={openField === "end"}
          onOpenChange={(open) => setOpenField(open ? "end" : null)}
          onChange={(end) => setDraft((prev) => ({ ...prev, end }))}
        />
      </div>

      {error && (
        <p role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="mt-4 flex justify-end gap-2">
        <Button
          onClick={clear}
          disabled={!isActive && !hasDraft}
          className="min-w-0 disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faXmark} className="text-xs" />
          Clear
        </Button>
        <Button color="primary" onClick={() => apply(draft)}>
          Apply
        </Button>
      </div>
    </section>
  );
}
