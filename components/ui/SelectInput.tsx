"use client";

import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { twJoin } from "tailwind-merge";

type Option = {
  value: string;
  label: string;
};

type Props = {
  label?: string;
  options?: Option[];
  value?: string;
  onChange?: (value: string) => void;
};

export default function SelectInput({
  label,
  options = [],
  value = "",
  onChange,
}: Props) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const selected = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex w-full flex-col gap-1" ref={ref}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-surface-foreground"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <button
          id={id}
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className={twJoin(
            "w-full overflow-hidden rounded-lg",
            "border border-surface-foreground/30 bg-surface-card shadow",
            "px-4 py-2 text-left text-surface-foreground",
            "outline-none cursor-pointer",
            "transition-[border-color,box-shadow] duration-200",
            "focus:border-surface-foreground/50",
            "focus:ring-2 focus:ring-surface-foreground/15",
            "shadow-effect dark:light-effect",
          )}
        >
          <span className="relative z-10 flex items-center justify-between">
            <span>{selected?.label ?? ""}</span>
            <FontAwesomeIcon
              icon={faChevronDown}
              data-open={isOpen || undefined}
              className="data-open:rotate-180 duration-200"
            />
          </span>
        </button>

        {isOpen && (
          <div
            className={twJoin(
              "absolute z-40 mt-1 w-full overflow-hidden rounded-lg space-y-0.5",
              "border border-surface-foreground/30 bg-surface-card shadow",
              "p-1",
            )}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                data-selected={option.value === value || undefined}
                onClick={() => {
                  onChange?.(option.value);
                  setIsOpen(false);
                }}
                className={twJoin(
                  "w-full rounded-md px-3 py-2 text-left text-sm cursor-pointer",
                  "text-surface-foreground",
                  "transition-colors duration-200",
                  "hover:bg-surface-foreground/10",
                  "data-selected:bg-surface-foreground/10",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        <input type="hidden" id={id} value={value} />
      </div>
    </div>
  );
}
