"use client";
import Image from "next/image";

import { useEffect, useId, useRef, useState, type ComponentProps, type KeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils/cn";
import { Button } from "./button";
import { Icon } from "./icon";
import { ChevronIcon } from "@/components/icons/chevron";

export type SelectOption = { value: string; label: string; image?: string; disabled?: boolean };
export type SelectProps = Omit<ComponentProps<"button">, "value" | "onChange" | "children" | "defaultValue"> & {
  options: readonly SelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  name?: string;
  leadingIcon?: ReactNode;
  appearance?: "surface" | "bare";
  showChevron?: boolean;
  iconOnlyOnMobile?: boolean;
  showCheck?: boolean;
  menuMinWidth?: number;
};
type MenuPosition = { top: number; left: number; width: number; maxHeight: number };

export function Select({ options, value, onValueChange, placeholder = "—", className, disabled, name, id, onKeyDown, appearance = "surface", leadingIcon, iconOnlyOnMobile = false, showChevron = true, showCheck = true, menuMinWidth = 208, ...props }: SelectProps) {
  const listId = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const search = useRef({ text: "", time: 0 });
  const [position, setPosition] = useState<MenuPosition | null>(null);
  const [active, setActive] = useState(-1);
  const selected = options.findIndex(option => option.value === value);
  const open = position !== null && !disabled;
  const enabled = options.map((option, index) => option.disabled ? -1 : index).filter(index => index >= 0);

  function close() { setPosition(null); }
  function show(index = selected) {
    if (disabled || !trigger.current) return;
    const rect = trigger.current.getBoundingClientRect();
    const width = Math.min(Math.max(rect.width, menuMinWidth), window.innerWidth - 24);
    const below = window.innerHeight - rect.bottom - 20;
    const above = rect.top - 20;
    const height = Math.min(options.length * 44 + 16, 288);
    const upward = below < height && above > below;
    const maxHeight = Math.max(44, Math.min(upward ? above : below, 288));
    const rtl = getComputedStyle(trigger.current).direction === "rtl";
    setPosition({
      top: upward ? Math.max(12, rect.top - Math.min(height, maxHeight) - 8) : rect.bottom + 8,
      left: Math.max(12, Math.min(rtl ? rect.right - width : rect.left, window.innerWidth - width - 12)),
      width,
      maxHeight,
    });
    setActive(enabled.includes(index) ? index : enabled[0] ?? -1);
  }
  function choose(index: number) {
    if (index < 0 || !options[index] || options[index].disabled) return;
    onValueChange(options[index].value);
    close();
    trigger.current?.focus({ preventScroll: true });
  }
  function keydown(event: KeyboardEvent<HTMLButtonElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === "Tab") { close(); return; }
    if (event.key === "Escape") { if (open) { event.preventDefault(); close(); } return; }
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      if (!open) { show(event.key === "End" || event.key === "ArrowUp" ? enabled.at(-1) : selected); return; }
      const current = enabled.indexOf(active);
      const next = event.key === "Home" ? 0 : event.key === "End" ? enabled.length - 1 : (current + (event.key === "ArrowDown" ? 1 : -1) + enabled.length) % enabled.length;
      setActive(enabled[next] ?? -1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) choose(active); else show();
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const now = Date.now();
      search.current = { text: now - search.current.time > 700 ? event.key : search.current.text + event.key, time: now };
      const match = options.findIndex(option => !option.disabled && option.label.toLocaleLowerCase().startsWith(search.current.text.toLocaleLowerCase()));
      if (match >= 0) { event.preventDefault(); if (open) setActive(match); else show(match); }
    }
  }

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!trigger.current?.contains(target) && !menu.current?.contains(target)) setPosition(null);
    };
    const moved = (event: Event) => { if (!menu.current?.contains(event.target as Node)) setPosition(null); };
    document.addEventListener("pointerdown", outside);
    window.addEventListener("resize", moved);
    window.addEventListener("scroll", moved, true);
    return () => {
      document.removeEventListener("pointerdown", outside);
      window.removeEventListener("resize", moved);
      window.removeEventListener("scroll", moved, true);
    };
  }, [open]);
  useEffect(() => {
    if (open) document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, open, listId]);

  return (
    <>
      {name && <input type="hidden" name={name} value={value} disabled={disabled} />}
      <Button
        {...props}
        id={id}
        ref={trigger}
        variant="unstyled"
        disabled={disabled}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
        className={cn(
          "group relative inline-flex h-11 min-w-[var(--select-min-width,9rem)] items-center justify-between gap-4 rounded-xl px-3.5 text-xs text-base-900 dark:text-title",
          appearance === "surface" ? "bg-gradient-to-br from-white to-info-100/60 shadow-sm ring-1 ring-inset ring-info-500/20 hover:ring-primary-400/50 dark:from-card-300 dark:to-card-400 dark:ring-white/10" : "bg-transparent hover:bg-primary-500/10",
          open && appearance === "surface" && "ring-primary-400/60 dark:ring-primary-400/60",
          iconOnlyOnMobile && "max-sm:justify-center max-sm:gap-0 max-sm:p-0",
          className,
        )}
        onClick={() => open ? close() : show()}
        onKeyDown={keydown}
        onBlur={close}
      >
        <span className={cn("flex min-w-0 items-center gap-2", iconOnlyOnMobile && "max-sm:justify-center max-sm:gap-0")}>
          {leadingIcon && <span aria-hidden="true" className="flex shrink-0 items-center justify-center leading-none text-primary-400 [&>svg]:block">{leadingIcon}</span>}
          {options[selected]?.image && <Image src={options[selected].image} width={24} height={24} alt="" className="size-6 shrink-0 rounded-md object-cover"/>}
          <span className={cn("truncate", iconOnlyOnMobile && "max-sm:hidden")}>{options[selected]?.label ?? placeholder}</span>
        </span>
        {showChevron && <ChevronIcon size={14} className={cn("shrink-0 text-primary-400 transition-transform duration-150 motion-reduce:transition-none", iconOnlyOnMobile && "max-sm:hidden", open && "rotate-180")} />}
      </Button>
      {open && createPortal(
        <div
          ref={menu}
          id={listId}
          role="listbox"
          aria-label={props["aria-label"]}
          aria-labelledby={props["aria-labelledby"]}
          className="fixed z-[100] overflow-y-auto rounded-xl border border-primary-400/20 bg-gradient-to-br from-white to-info-50 p-1.5 shadow-[0_16px_45px_#0a001a30] dark:from-background-100 dark:to-card-400 dark:shadow-[0_18px_50px_#0008]"
          style={position ?? undefined}
          onPointerDown={event => event.preventDefault()}
        >
          {options.map((option, index) => (
            <div
              key={option.value}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={option.value === value}
              aria-disabled={option.disabled || undefined}
              onPointerMove={() => { if (!option.disabled) setActive(index); }}
              onClick={() => choose(index)}
              className={cn(
                "flex min-h-11 cursor-pointer items-center justify-between gap-4 rounded-lg px-3 text-xs transition-colors duration-100 motion-reduce:transition-none",
                option.value === value ? "bg-primary-500/10 font-medium text-primary-700 dark:bg-primary-500/20 dark:text-primary-200" : "text-base-700 dark:text-paragraph",
                active === index && "bg-primary-500/10 ring-1 ring-inset ring-primary-400/15 dark:bg-primary-500/15",
                option.disabled && "cursor-not-allowed opacity-40",
              )}
            >
              {option.image && <Image src={option.image} width={24} height={24} alt="" className="size-6 shrink-0 rounded-md object-cover"/>}<span>{option.label}</span>
              {showCheck && option.value === value && <Icon name="check" className="size-4 text-primary-500 dark:text-primary-300" />}
            </div>
          ))}
        </div>, document.body,
      )}
    </>
  );
}
