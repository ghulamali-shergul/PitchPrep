"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import Container from "@/components/ui/Container";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const publicLinks = [{ href: "/", label: "Home" }];

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
    <header className="sticky top-0 z-40 border-b border-border bg-white/80 backdrop-blur-md">
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
