"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { UserRole } from "@/lib/types";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, user } = useAuth();

  const [role, setRole] = useState<UserRole>("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, show a redirect option
  if (isAuthenticated && user) {
    const dest = user.role === "admin" ? "/admin" : "/app";
    router.push(dest);
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const success = await login(email, password, role);
    setLoading(false);

    if (success) {
      router.push(role === "admin" ? "/admin" : "/app");
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  // Prefill credentials on role switch
  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setError("");
    if (newRole === "admin") {
      setEmail("admin@pitchprep.com");
      setPassword("admin123");
    } else {
      setEmail("user@gmail.com");
      setPassword("12345");
    }
  };

  return (
    <Container className="flex items-center justify-center py-16 sm:py-24">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white font-bold text-xl shadow-lg shadow-primary/20">
            PP
          </div>
          <h1 className="text-2xl font-bold text-foreground">Sign in to PitchPrep</h1>
          <p className="text-sm text-muted mt-1">Choose your role to get started</p>
        </div>

        {/* Role Toggle */}
        <div className="flex rounded-xl bg-secondary p-1 mb-6">
          <button
            onClick={() => handleRoleChange("user")}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
              role === "user"
                ? "bg-white text-foreground shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
          >
            👤 Student / User
          </button>
          <button
            onClick={() => handleRoleChange("admin")}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
              role === "admin"
                ? "bg-white text-foreground shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
          >
            🛡️ Admin
          </button>
        </div>

        {/* Login Form */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder={role === "admin" ? "admin@pitchprep.com" : "user@gmail.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full" size="lg">
              {role === "admin" ? "Sign in as Admin" : "Sign in as Student"}
            </Button>
          </form>
        </Card>

        {/* Demo credentials hint removed per request */}
      </div>
    </Container>
  );
}
