import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
export function Input({ className, ...props }: ComponentProps<"input">) {
    return <input {...props} className={cn("min-w-0 bg-transparent outline-none disabled:cursor-not-allowed disabled:opacity-60", className)}/>;
}
export function InputGroup({ children, className, ...props }: ComponentProps<"div">) {
    return <div {...props} className={cn("flex h-[50px] items-center gap-[11px] rounded-[10px] border border-(--line) bg-[#97a1af06] px-3.5 text-(--muted) transition-[border-color,box-shadow] focus-within:border-primary-500 focus-within:shadow-[0_0_0_3px_#8d2ceb12] has-[input[aria-invalid=true]]:border-error-500 [&>svg]:shrink-0 [color-scheme:light] dark:[color-scheme:dark] [--input-fill:color-mix(in_srgb,#97a1af_2.35%,var(--surface))] [&_input]:h-full [&_input]:w-full [&_input]:font-inter [&_input]:text-[13px] [&_input]:text-foreground [&_input::placeholder]:text-xs [&_input::placeholder]:text-disable [&_input:autofill]:[box-shadow:0_0_0_1000px_var(--input-fill)_inset] [&_input:autofill]:[-webkit-text-fill-color:var(--foreground)] [&_input:autofill]:caret-foreground [&_input:-webkit-autofill]:[box-shadow:0_0_0_1000px_var(--input-fill)_inset] [&_input:-webkit-autofill]:[-webkit-text-fill-color:var(--foreground)] [&_input:-webkit-autofill]:caret-foreground", className)}>{children}</div>;
}
export function FormField({ label, htmlFor, children, className }: {
    label: ReactNode;
    htmlFor: string;
    children: ReactNode;
    className?: string;
}) {
    return <div className={cn("flex flex-col gap-[9px]", className)}><label htmlFor={htmlFor} className="text-xs font-medium">{label}</label>{children}</div>;
}
