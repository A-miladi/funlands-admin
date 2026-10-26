"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const clientSnapshot = () => false;
const serverSnapshot = () => true;

export function DocumentBootstrap({ code }: { code: string }) {
  // Execute during HTML parsing, but never create a script on client navigation.
  const initialDocument = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  return initialDocument ? (
    <script id="theme-preference" dangerouslySetInnerHTML={{ __html: code }} />
  ) : null;
}
