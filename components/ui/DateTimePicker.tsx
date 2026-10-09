"use client";

import {
  faCalendarDays,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parse,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { useId, useMemo, useState } from "react";
import { twJoin } from "tailwind-merge";

/** Value format shared with the rest of the app: "yyyy-MM-ddTHH:mm" */
const VALUE_FORMAT = "yyyy-MM-dd'T'HH:mm";
const DISPLAY_FORMAT = "dd-MM-yyyy · HH:mm";
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MINUTE_STEP = 5;

const parseValue = (value?: string) =>
  value ? parse(value, VALUE_FORMAT, new Date()) : null;
const toValue = (date: Date) => format(date, VALUE_FORMAT);
const pad = (n: number) => String(n).padStart(2, "0");

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Earliest selectable value ("yyyy-MM-ddTHH:mm") */
  min?: string;
  /** Latest selectable value ("yyyy-MM-ddTHH:mm") */
  max?: string;
  /** Time used when a day is picked before any time ("HH:mm") */
  defaultTime?: string;
  placeholder?: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export default function DateTimePicker({
  label,
  value,
  onChange,
  min,
  max,
  defaultTime = "00:00",
  placeholder = "Any time",
  isOpen,
  onOpenChange,
}: Props) {
  const id = useId();
  const selected = parseValue(value);
  const minDate = parseValue(min);
  const maxDate = parseValue(max);

  const [viewMonth, setViewMonth] = useState(() =>
    startOfMonth(selected ?? maxDate ?? new Date()),
  );

  function toggle() {
    if (!isOpen) {
      // Jump the calendar to the selected month when opening
      setViewMonth(startOfMonth(selected ?? maxDate ?? new Date()));
    }
    onOpenChange(!isOpen);
  }

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(viewMonth));
    const end = endOfWeek(endOfMonth(viewMonth));
    const list: Date[] = [];
    for (let day = start; day <= end; day = addDays(day, 1)) list.push(day);
    return list;
  }, [viewMonth]);

  function clamp(date: Date) {
    if (minDate && date < minDate) return minDate;
    if (maxDate && date > maxDate) return maxDate;
    return date;
  }

  function commit(date: Date) {
    onChange(toValue(clamp(date)));
  }

  function isDayDisabled(day: Date) {
    if (minDate && day < startOfDay(minDate)) return true;
    if (maxDate && day > maxDate) return true;
    return false;
  }

  function pickDay(day: Date) {
    const [h, m] = selected
      ? [selected.getHours(), selected.getMinutes()]
      : defaultTime.split(":").map(Number);
    const next = new Date(day);
    next.setHours(h, m, 0, 0);
    commit(next);
  }

  function setTime(hours: number, minutes: number) {
    const base = selected ?? new Date();
    const next = new Date(base);
    next.setHours(((hours % 24) + 24) % 24, ((minutes % 60) + 60) % 60, 0, 0);
    commit(next);
  }

  const canGoNext = !maxDate || addMonths(viewMonth, 1) <= maxDate;
  const canGoPrev = !minDate || viewMonth > minDate;
  const today = new Date();

  return (
    <div className="flex w-full flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium text-surface-foreground"
      >
        {label}
      </label>

      <button
        id={id}
        type="button"
        aria-expanded={isOpen}
        data-open={isOpen || undefined}
        onClick={toggle}
        className={twJoin(
          "h-11 w-full rounded-soft px-3.5 text-left",
          "bg-text/3 ring-1 ring-border cursor-pointer outline-none",
          "transition-[box-shadow,background-color] duration-200",
          "hover:ring-text/15",
          "focus-visible:ring-2 focus-visible:ring-primary/70",
          "data-open:bg-surface-card data-open:ring-2 data-open:ring-primary/70",
        )}
      >
        <span className="flex items-center justify-between gap-3">
          <span
            className={twJoin(
              "truncate tabular-nums",
              selected ? "text-surface-foreground" : "text-muted",
            )}
          >
            {selected ? format(selected, DISPLAY_FORMAT) : placeholder}
          </span>
          <FontAwesomeIcon
            icon={faCalendarDays}
            className="text-sm text-muted"
          />
        </span>
      </button>

      {isOpen && (
        <div className="mt-1 rounded-soft bg-surface-card p-3 ring-1 ring-border shadow-shadow origin-top animate-pop">
          {/* Month navigation */}
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              aria-label="Previous month"
              disabled={!canGoPrev}
              onClick={() => setViewMonth((m) => addMonths(m, -1))}
              className="grid size-9 place-items-center rounded-full text-muted cursor-pointer transition-colors hover:bg-text/6 hover:text-text disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-default"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
            </button>
            <span className="text-sm font-semibold tracking-tight">
              {format(viewMonth, "MMMM yyyy")}
            </span>
            <button
              type="button"
              aria-label="Next month"
              disabled={!canGoNext}
              onClick={() => setViewMonth((m) => addMonths(m, 1))}
              className="grid size-9 place-items-center rounded-full text-muted cursor-pointer transition-colors hover:bg-text/6 hover:text-text disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-default"
            >
              <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
            </button>
          </div>

          {/* Calendar */}
          <div className="grid grid-cols-7 gap-0.5 text-center">
            {WEEKDAYS.map((day) => (
              <span
                key={day}
                className="pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted"
              >
                {day}
              </span>
            ))}
            {days.map((day) => {
              const isSelected = selected && isSameDay(day, selected);
              const isToday = isSameDay(day, today);
              const isOutside = !isSameMonth(day, viewMonth);
              const isDisabled = isDayDisabled(day);

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => pickDay(day)}
                  data-selected={isSelected || undefined}
                  data-today={isToday || undefined}
                  data-outside={isOutside || undefined}
                  aria-label={format(day, "dd-MM-yyyy")}
                  aria-pressed={!!isSelected}
                  className={twJoin(
                    "mx-auto grid size-9 place-items-center rounded-full text-sm tabular-nums cursor-pointer",
                    "transition-colors duration-150 hover:bg-text/6",
                    "data-outside:text-muted/60",
                    "data-today:font-semibold data-today:text-primary data-today:ring-1 data-today:ring-primary/40",
                    "data-selected:bg-primary data-selected:text-primary-foreground data-selected:ring-0 data-selected:hover:bg-primary",
                    "disabled:opacity-25 disabled:cursor-default disabled:hover:bg-transparent",
                  )}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>

          {/* Time (24h) */}
          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between gap-3">
            <span className="text-sm text-muted">Time</span>
            <div className="flex items-center gap-1.5">
              <TimeUnit
                label="Hours"
                value={selected ? selected.getHours() : null}
                placeholder={defaultTime.split(":")[0]}
                max={23}
                step={1}
                onChange={(h) =>
                  setTime(
                    h,
                    selected
                      ? selected.getMinutes()
                      : Number(defaultTime.split(":")[1]),
                  )
                }
              />
              <span className="text-lg font-semibold text-muted">:</span>
              <TimeUnit
                label="Minutes"
                value={selected ? selected.getMinutes() : null}
                placeholder={defaultTime.split(":")[1]}
                max={59}
                step={MINUTE_STEP}
                onChange={(m) =>
                  setTime(
                    selected
                      ? selected.getHours()
                      : Number(defaultTime.split(":")[0]),
                    m,
                  )
                }
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => commit(new Date())}
                className="h-8 px-3 rounded-full text-xs font-medium text-primary cursor-pointer transition-colors hover:bg-primary/10"
              >
                Now
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                disabled={!value}
                className="h-8 px-3 rounded-full text-xs font-medium text-muted cursor-pointer transition-colors hover:bg-text/6 hover:text-text disabled:opacity-40 disabled:cursor-default disabled:hover:bg-transparent"
              >
                Clear
              </button>
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-8 px-4 rounded-full bg-primary text-xs font-semibold text-primary-foreground cursor-pointer transition-colors hover:bg-primary-hover"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Two-digit 24h time unit with up/down steppers and direct typing */
function TimeUnit({
  label,
  value,
  placeholder,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number | null;
  placeholder: string;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const current = value ?? Number(placeholder);

  function stepBy(direction: 1 | -1) {
    // Snap to the step grid (e.g. 07 -> 10 / 05 for minutes)
    const snapped =
      direction === 1
        ? Math.floor(current / step) * step + step
        : Math.ceil(current / step) * step - step;
    onChange(((snapped % (max + 1)) + (max + 1)) % (max + 1));
  }

  function commitDraft() {
    if (draft === null) return;
    const n = Number(draft);
    if (draft !== "" && Number.isInteger(n) && n >= 0 && n <= max) onChange(n);
    setDraft(null);
  }

  return (
    <div className="flex items-center rounded-soft bg-text/3 ring-1 ring-border">
      <input
        aria-label={label}
        inputMode="numeric"
        maxLength={2}
        value={draft ?? (value === null ? "" : pad(value))}
        placeholder={placeholder}
        onFocus={(e) => e.currentTarget.select()}
        onChange={(e) => setDraft(e.target.value.replace(/\D/g, ""))}
        onBlur={commitDraft}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.currentTarget.blur();
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            stepBy(1);
          } else if (e.key === "ArrowDown") {
            e.preventDefault();
            stepBy(-1);
          }
        }}
        className="h-10 w-10 bg-transparent text-center text-base font-semibold tabular-nums outline-none placeholder:text-muted"
      />
      <div className="flex flex-col border-l border-border">
        <button
          type="button"
          aria-label={`Increase ${label.toLowerCase()}`}
          onClick={() => stepBy(1)}
          className="grid h-5 w-7 place-items-center text-[10px] text-muted cursor-pointer transition-colors hover:bg-text/6 hover:text-text rounded-tr-soft"
        >
          <FontAwesomeIcon icon={faChevronUp} />
        </button>
        <button
          type="button"
          aria-label={`Decrease ${label.toLowerCase()}`}
          onClick={() => stepBy(-1)}
          className="grid h-5 w-7 place-items-center text-[10px] text-muted cursor-pointer transition-colors hover:bg-text/6 hover:text-text rounded-br-soft"
        >
          <FontAwesomeIcon icon={faChevronDown} />
        </button>
      </div>
    </div>
  );
}
