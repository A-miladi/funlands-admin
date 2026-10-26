import type { ReactNode } from "react";
export function SectionHeading({ title, description }: {
    title: ReactNode;
    description?: ReactNode;
}) {
    return <div><h2 className="text-sm font-semibold">{title}</h2>{description && <p className="mt-1 text-[10px] text-base-600 dark:text-paragraph">{description}</p>}</div>;
}
