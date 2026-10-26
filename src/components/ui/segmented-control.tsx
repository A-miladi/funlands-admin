import type { ReactNode } from "react";
import { Button } from "./button";
import { Card } from "./card";
import { cn } from "@/lib/utils/cn";
export function SegmentedControl({ value, onValueChange, options, label, className }: {
    value: string;
    onValueChange: (value: string) => void;
    options: readonly {
        value: string;
        label: ReactNode;
    }[];
    label: string;
    className?: string;
}) {
    return <Card role="group" aria-label={label} className={cn("flex gap-1 p-1", className)}>{options.map(option => <Button key={option.value} variant="unstyled" aria-pressed={value === option.value} onClick={() => onValueChange(option.value)} className={cn("rounded-lg px-4 py-2 text-[11px]", value === option.value ? "bg-primary-500 text-white shadow-sm" : "text-base-600 hover:bg-primary-500/5 dark:text-paragraph")}>{option.label}</Button>)}</Card>;
}
