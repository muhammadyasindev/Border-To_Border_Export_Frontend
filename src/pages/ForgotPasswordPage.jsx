import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, KeyRound, ArrowRight, CheckCircle2, ShieldCheck, ArrowLeft } from "lucide-react";
import { safeFetch } from "../lib/api.js";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await safeFetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error(res.error || "Failed to process request");
      }

      setSuccessMsg(res.data?.message || "OTP code sent to your email");
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await safeFetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, otp, newPassword }),
      });

      if (!res.ok) {
        throw new Error(res.error || "Failed to reset password");
      }

      setSuccessMsg(res.data?.message || "Password updated successfully");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#172B4D] flex flex-col justify-between font-sans">
      <header className="bg-[#142B4A] text-white py-4 px-6 border-b border-[#0f2139]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-xs">
              BG
            </div>
            <span className="font-extrabold text-base tracking-tight">
              Border<span className="text-blue-400">Glow</span>
            </span>
          </Link>
          <div className="text-xs text-slate-300">
            Remember password?{" "}
            <Link to="/login" className="text-blue-400 font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-md w-full mx-auto p-4 sm:p-6 my-10">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#142B4A]">
              {step === 1 ? "Password Recovery" : "Enter Verification Code"}
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              {step === 1
                ? "Enter your registered email to receive a secure single-use recovery code."
                : `We dispatched a 6-digit recovery code to ${email}.`}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Registered Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@business.trade"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Sending Code..." : "Send Verification Code"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  6-Digit Verification Code (OTP) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full text-center tracking-widest font-mono text-base font-bold py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Password (Min 8 characters) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs rounded-xl transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  disabled={loading || !otp || !newPassword}
                  className="flex-1 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Resetting..." : "Reset Password & Sign In"}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link to="/login" className="hover:text-slate-800 flex items-center gap-1">
              ← Back to Sign In
            </Link>
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> Bank-Grade Security
            </span>
          </div>
        </div>
      </div>

      <footer className="text-center py-4 text-xs text-slate-400 border-t border-slate-200 bg-white">
        BorderGlow B2B Trade & Logistics • PK ⇄ IR ⇄ AF ⇄ CN Corridors
      </footer>
    </div>
  );
}

export default ForgotPasswordPage;
