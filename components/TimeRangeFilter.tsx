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
  /** Label of the preset that produced this range, if any */
  preset?: string;
};

export const EMPTY_RANGE: TimeRange = { start: "", end: "" };

const toInputValue = (date: Date) => format(date, "yyyy-MM-dd'T'HH:mm");

const PRESETS: {
  label: string;
  range: () => Omit<TimeRange, "preset">;
}[] = [
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
  const [openField, setOpenField] = useState<"start" | "end" | null>(null);

  // Keep the fields in sync when the range is applied or cleared from outside
  // (e.g. the × on the range chip above the list).
  const [prevApplied, setPrevApplied] = useState(appliedRange);
  if (appliedRange !== prevApplied) {
    setPrevApplied(appliedRange);
    setDraft(appliedRange ?? EMPTY_RANGE);
    setOpenField(null);
  }

  const now = toInputValue(new Date());
  const isActive = appliedRange !== null;
  const hasDraft = Boolean(draft.start || draft.end);
  const isOrderInvalid = Boolean(
    draft.start && draft.end && draft.start >= draft.end,
  );
  const isUnchanged =
    appliedRange !== null &&
    draft.start === appliedRange.start &&
    draft.end === appliedRange.end;
  const canApply = hasDraft && !isOrderInvalid && !isUnchanged;

  /** Editing a field turns the range into a custom one */
  function editField(field: "start" | "end", value: string) {
    setDraft((prev) => ({ ...prev, [field]: value, preset: undefined }));
  }

  function apply(range: TimeRange) {
    setOpenField(null);
    setDraft(range);
    onApply(range);
  }

  function applyPreset(preset: (typeof PRESETS)[number]) {
    apply({ ...preset.range(), preset: preset.label });
  }

  function applyCustom() {
    if (!canApply) return;
    apply({ start: draft.start, end: draft.end });
  }

  function clear() {
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
        {PRESETS.map((preset) => {
          // Highlighted while it is the applied range and the fields
          // haven't been edited since
          const isSelected =
            draft.preset === preset.label ||
            (isUnchanged && appliedRange?.preset === preset.label);

          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => applyPreset(preset)}
              aria-pressed={isSelected}
              data-selected={isSelected || undefined}
              className="h-8 px-3 rounded-full text-xs font-medium bg-text/4 ring-1 ring-border cursor-pointer transition-[background-color,color,box-shadow] duration-200 hover:bg-text/8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary data-selected:bg-primary data-selected:text-primary-foreground data-selected:ring-primary data-selected:shadow-active data-selected:hover:bg-primary-hover"
            >
              {preset.label}
            </button>
          );
        })}
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
          onChange={(start) => editField("start", start)}
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
          onChange={(end) => editField("end", end)}
        />
      </div>

      {isOrderInvalid && (
        <p role="alert" className="mt-2 text-sm text-danger">
          The start time must be before the end time.
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
        <Button
          color="primary"
          onClick={applyCustom}
          disabled={!canApply}
          className="disabled:opacity-40 disabled:shadow-none"
        >
          Apply
        </Button>
      </div>
    </section>
  );
}
