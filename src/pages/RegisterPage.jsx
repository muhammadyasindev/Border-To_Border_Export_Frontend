import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  Truck,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  RefreshCw,
} from "lucide-react";
import { EditableSelect } from "../components/ui/EditableSelect.jsx";
import { safeFetch, setAuthToken } from "../lib/api.js";
import { BORDER_COUNTRIES, CORRIDOR_CITIES } from "../lib/constants.js";

export function RegisterPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("exporter");
  const [step, setStep] = useState(1);

  // Common fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [cnicNumber, setCnicNumber] = useState("");

  // Exporter / Importer fields
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");

  // Driver specific fields
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState("");
  const [licenseExpiryDate, setLicenseExpiryDate] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  // OTP Verification fields
  const [otp, setOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Step 2 Submission -> Sends OTP to email and moves to Step 3
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !password) {
      setError("Please complete all required fields (Name, Email, Password).");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setSendingOtp(true);

    try {
      const res = await safeFetch("/api/auth/register/send-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error(res.error || "Failed to dispatch verification code");
      }

      setStep(3);
      setResendCooldown(30);
    } catch (err) {
      setError(err.message);
    } finally {
      setSendingOtp(false);
    }
  };

  // Step 3 Submission -> Verifies OTP and creates user account
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp || otp.trim().length !== 6) {
      setError("Please enter the 6-digit verification code sent to your email.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        role,
        fullName,
        email,
        password,
        country: country || "Pakistan",
        city: city || "Quetta",
        phone,
        cnicNumber,
        otp: otp.trim(),
      };

      if (role === "driver") {
        payload.drivingLicenseNumber = drivingLicenseNumber;
        payload.licenseExpiryDate = licenseExpiryDate;
        payload.plateNumber = plateNumber;
        payload.vehicleType = vehicleType;
        payload.businessName = "Independent Haulage Operator";
      } else {
        payload.businessName = businessName;
        payload.businessAddress = businessAddress;
      }

      const res = await safeFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(res.error || "Registration verification failed");
      }

      const data = res.data;
      if (data?.token) {
        setAuthToken(data.token);
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || sendingOtp) return;
    setError("");
    setSendingOtp(true);

    try {
      const res = await safeFetch("/api/auth/register/send-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        throw new Error(res.error || "Failed to resend code");
      }
      setResendCooldown(30);
    } catch (err) {
      setError(err.message);
    } finally {
      setSendingOtp(false);
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
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-xl w-full mx-auto p-4 sm:p-6 my-8">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-extrabold text-[#142B4A]">Register Corridor Account</h1>
            <p className="text-xs text-[#64748B] mt-1">
              Join the regional B2B trade network for Pakistan ⇄ Iran ⇄ Afghanistan ⇄ China
            </p>

            {/* Stepper Indicator */}
            <div className="flex items-center justify-center gap-2 mt-4 text-xs font-semibold">
              <span className={`px-2.5 py-1 rounded-full ${step === 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                1. Role
              </span>
              <span className="text-slate-300">→</span>
              <span className={`px-2.5 py-1 rounded-full ${step === 2 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                2. Details
              </span>
              <span className="text-slate-300">→</span>
              <span className={`px-2.5 py-1 rounded-full ${step === 3 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                3. Email OTP
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs">
              {error}
            </div>
          )}

          {/* STEP 1: Select Role */}
          {step === 1 && (
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select Your Primary Corridor Role *
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("exporter")}
                  className={`p-4 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                    role === "exporter"
                      ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <ShoppingBag className={`w-6 h-6 mb-2 ${role === "exporter" ? "text-blue-600" : "text-slate-400"}`} />
                  <div>
                    <div className="font-bold text-xs text-[#142B4A]">Exporter</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Sell commodities & goods</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("importer")}
                  className={`p-4 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                    role === "importer"
                      ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <Package className={`w-6 h-6 mb-2 ${role === "importer" ? "text-blue-600" : "text-slate-400"}`} />
                  <div>
                    <div className="font-bold text-xs text-[#142B4A]">Importer / Buyer</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Procure bulk materials</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("driver")}
                  className={`p-4 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                    role === "driver"
                      ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <Truck className={`w-6 h-6 mb-2 ${role === "driver" ? "text-blue-600" : "text-slate-400"}`} />
                  <div>
                    <div className="font-bold text-xs text-[#142B4A]">Haulier / Driver</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Cross-border road freight</div>
                  </div>
                </button>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  Continue to Profile Details <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Profile & Details */}
          {step === 2 && (
            <form onSubmit={handleRequestOtp} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muhammad Yasin"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    National ID / CNIC *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 54400-1234567-1"
                    value={cnicNumber}
                    onChange={(e) => setCnicNumber(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
                  />
                </div>
              </div>

              {/* Role-Specific Fields */}
              {role !== "driver" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Business Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bolan Trading Co."
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Business Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="Warehouse or office location"
                      value={businessAddress}
                      onChange={(e) => setBusinessAddress(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Driving License Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="Commercial HTV/LTV Number"
                      value={drivingLicenseNumber}
                      onChange={(e) => setDrivingLicenseNumber(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Truck Plate Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. QTA-8842"
                      value={plateNumber}
                      onChange={(e) => setPlateNumber(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
                    />
                  </div>
                </div>
              )}

              {/* Email & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@business.trade"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Password * (Min 8 chars)</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
                  />
                </div>
              </div>

              {/* Country, City, Phone with EditableSelect */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <EditableSelect
                    label="Country Base *"
                    value={country}
                    onChange={setCountry}
                    options={BORDER_COUNTRIES}
                  />
                </div>

                <div>
                  <EditableSelect
                    label="City / Trade Hub *"
                    value={city}
                    onChange={setCity}
                    options={CORRIDOR_CITIES}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="+92 332 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 flex items-start gap-2">
                <Lock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>
                  To ensure legitimate trade accounts, a 6-digit verification code will be dispatched to your email address before account activation.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  ← Back to Role
                </button>
                <button
                  type="submit"
                  disabled={sendingOtp}
                  className="px-6 py-2.5 text-xs font-semibold bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  {sendingOtp ? "Sending Verification Code..." : "Continue to Email Verification →"}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Enter 6-Digit Email OTP */}
          {step === 3 && (
            <form onSubmit={handleVerifyAndRegister} className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 mx-auto flex items-center justify-center mb-1">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-blue-950">Verify Your Email Address</h3>
                <p className="text-xs text-blue-800">
                  We sent a single-use 6-digit code to: <strong className="text-blue-950">{email}</strong>
                </p>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-[11px] text-blue-600 hover:underline font-semibold mt-1 cursor-pointer"
                >
                  Wrong email? Edit details
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider text-center mb-2">
                  Enter 6-Digit Verification Code *
                </label>
                <div className="relative max-w-xs mx-auto">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    autoFocus
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full text-center text-xl tracking-[0.5em] font-mono font-bold py-3 bg-slate-50 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white text-slate-900"
                  />
                </div>
                <p className="text-[11px] text-slate-400 text-center mt-1.5">
                  Code expires in 15 minutes. Check spam folder if not received.
                </p>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={submitting || otp.length !== 6}
                  className="w-full py-2.5 text-xs font-bold bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Verifying & Creating Account..." : "Verify Code & Complete Registration"}
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0 || sendingOtp}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:text-slate-400 flex items-center gap-1 mx-auto cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${sendingOtp ? 'animate-spin' : ''}`} />
                    {resendCooldown > 0
                      ? `Resend code in ${resendCooldown}s`
                      : "Didn't receive code? Resend Code"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      <footer className="text-center py-4 text-xs text-slate-400 border-t border-slate-200 bg-white">
        BorderGlow B2B Trade & Logistics • PK ⇄ IR ⇄ AF ⇄ CN Corridors
      </footer>
    </div>
  );
}

export default RegisterPage;
