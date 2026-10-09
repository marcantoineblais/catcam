"use client";

import { faCheck, faChevronDown } from "@fortawesome/free-solid-svg-icons";
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
    <div className="flex w-full flex-col gap-1.5" ref={ref}>
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
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          data-open={isOpen || undefined}
          onClick={() => setIsOpen((open) => !open)}
          className={twJoin(
            "h-11 w-full rounded-soft px-3.5 text-left text-surface-foreground",
            "bg-text/3 ring-1 ring-border",
            "outline-none cursor-pointer",
            "transition-[box-shadow,background-color] duration-200",
            "hover:ring-text/15",
            "focus-visible:ring-2 focus-visible:ring-primary/70",
            "data-open:bg-surface-card data-open:ring-2 data-open:ring-primary/70",
          )}
        >
          <span className="relative z-10 flex items-center justify-between gap-3">
            <span className="truncate">{selected?.label ?? ""}</span>
            <FontAwesomeIcon
              icon={faChevronDown}
              data-open={isOpen || undefined}
              className="text-xs text-muted transition-transform duration-200 data-open:rotate-180"
            />
          </span>
        </button>

        {isOpen && (
          <div
            role="listbox"
            className={twJoin(
              "absolute z-40 mt-2 w-full overflow-hidden space-y-0.5 p-1.5",
              "rounded-soft bg-surface-card ring-1 ring-border shadow-elevated",
              "origin-top animate-pop",
            )}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={option.value === value}
                data-selected={option.value === value || undefined}
                onClick={() => {
                  onChange?.(option.value);
                  setIsOpen(false);
                }}
                className={twJoin(
                  "w-full flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm cursor-pointer",
                  "text-surface-foreground",
                  "transition-colors duration-150",
                  "hover:bg-text/5",
                  "data-selected:bg-primary/10 data-selected:font-medium data-selected:text-primary",
                )}
              >
                <span className="truncate">{option.label}</span>
                {option.value === value && (
                  <FontAwesomeIcon icon={faCheck} className="text-xs" />
                )}
              </button>
            ))}
          </div>
        )}

        <input type="hidden" value={value} />
      </div>
    </div>
  );
}
