"use client";

import React from "react";
import { ThemeProvider } from "@/lib/ThemeContext";
import { AuthProvider } from "@/lib/AuthContext";
import { CompanyStoreProvider } from "@/lib/CompanyStoreContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CompanyStoreProvider>{children}</CompanyStoreProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
