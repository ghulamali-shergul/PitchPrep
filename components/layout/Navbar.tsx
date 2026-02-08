"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useTheme } from "@/lib/ThemeContext";
import Container from "@/components/ui/Container";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const publicLinks: { href: string; label: string }[] = [];

  const userLinks = [
    { href: "/app", label: "Dashboard" },
    { href: "/profile", label: "Profile" },
  ];

  const adminLinks = [
    { href: "/admin", label: "Admin Panel" },
  ];

  const links = [
    ...publicLinks,
    ...(isAuthenticated && !isAdmin ? userLinks : []),
    ...(isAuthenticated && isAdmin ? adminLinks : []),
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">
              PP
            </div>
            <span className="text-lg font-bold text-foreground">PitchPrep</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-primary-light text-primary"
                    : "text-muted hover:text-foreground hover:bg-secondary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:bg-secondary hover:text-foreground"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              )}
            </button>

            {isAuthenticated && user ? (
              <>
                <div className="hidden sm:flex items-center gap-2 mr-1">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white ${isAdmin ? "bg-amber-500" : "bg-primary"}`}>
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-foreground leading-tight">{user.name}</p>
                    <p className="text-[10px] text-muted leading-tight">
                      {isAdmin ? "🛡️ Admin" : "👤 Student"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-secondary hover:text-foreground"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground hover:bg-secondary"
                >
                  Log in
                </Link>
                <Link
                  href="/login"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
}
