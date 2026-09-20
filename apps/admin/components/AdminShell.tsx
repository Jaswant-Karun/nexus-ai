import type { ReactNode } from "react";

export function AdminShell({ children }: { children: ReactNode }) {
  return <section>{children}</section>;
}
