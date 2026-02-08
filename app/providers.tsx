"use client";

import React from "react";
import { AuthProvider } from "@/lib/AuthContext";
import { CompanyStoreProvider } from "@/lib/CompanyStoreContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CompanyStoreProvider>{children}</CompanyStoreProvider>
    </AuthProvider>
  );
}
