"use client"; 

import { SessionProvider } from "next-auth/react";

export function SessionWrapper({ children }: React.PropsWithChildren) {
  return <SessionProvider>{children}</SessionProvider>;
};

