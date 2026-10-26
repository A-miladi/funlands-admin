"use client";

import { NextIntlClientProvider } from "next-intl";
import type { ComponentProps } from "react";

// Keep relative-time initialization in the browser. A shared static shell must
// never serialize its build-time clock as the current time for future visitors.
export function ClientIntlProvider(props: ComponentProps<typeof NextIntlClientProvider>) {
  return <NextIntlClientProvider {...props} />;
}
