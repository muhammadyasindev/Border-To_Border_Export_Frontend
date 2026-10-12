"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, ArrowRight, ShieldCheck, Briefcase } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"exporter" | "importer" | "driver" | "admin">("exporter");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role, fullName }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Check if user role matches selected role
      if (data.user?.role && data.user.role !== role && role !== "admin") {
        console.warn(`User logged in as ${data.user.role}, redirected to workspace.`);
      }

      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#172B4D] flex flex-col justify-between font-sans">
      <header className="bg-[#142B4A] text-white py-4 px-6 border-b border-[#0f2139]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-xs">
              BG
            </div>
            <span className="font-extrabold text-base tracking-tight">
              Border<span className="text-blue-400">Glow</span>
            </span>
          </Link>
          <div className="text-xs text-slate-300">
            Need an account?{" "}
            <Link href="/register" className="text-blue-400 font-semibold hover:underline">
              Register as Trader
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-md w-full mx-auto p-4 sm:p-6 my-10">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-extrabold text-[#142B4A]">Sign In to BorderGlow</h1>
            <p className="text-xs text-[#64748B] mt-1">
              Select your role, enter credentials and access your corridor workspace.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Select Your Role *
              </label>
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setRole("exporter")}
                  className={`py-1.5 text-[11px] font-semibold rounded-md transition ${
                    role === "exporter" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Exporter
                </button>
                <button
                  type="button"
                  onClick={() => setRole("importer")}
                  className={`py-1.5 text-[11px] font-semibold rounded-md transition ${
                    role === "importer" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Importer
                </button>
                <button
                  type="button"
                  onClick={() => setRole("driver")}
                  className={`py-1.5 text-[11px] font-semibold rounded-md transition ${
                    role === "driver" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Driver
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`py-1.5 text-[11px] font-semibold rounded-md transition ${
                    role === "admin" ? "bg-white text-amber-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            {/* Name Field (Requested by User) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Full Name (Optional)
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Muhammad Yasin"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Email or Username Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address or Username *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="name@business.trade or e.g. Muhammad Yasin"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">Password *</label>
                <Link href="/forgot-password" className="text-[11px] text-blue-600 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
            >
              {submitting ? "Signing In..." : `Sign In as ${role.toUpperCase()}`}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              New to BorderGlow?{" "}
              <Link href="/register" className="text-blue-600 font-bold hover:underline">
                Create your corridor account
              </Link>
            </p>
          </div>
        </div>
      </div>

      <footer className="text-center py-4 text-xs text-slate-400 border-t border-slate-200 bg-white">
        BorderGlow B2B Trade & Logistics • PK ⇄ IR ⇄ AF ⇄ CN Corridors
      </footer>
    </div>
  );
}
