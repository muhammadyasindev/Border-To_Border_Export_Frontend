"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import {
  Package,
  ShoppingBag,
  Truck,
  MessageSquare,
  FileText,
  Compass,
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Video,
  ShieldCheck,
  PhoneCall,
  Search,
  Filter,
  Check,
  ChevronRight,
  Handshake,
  Clock,
  Layers,
  ArrowUpRight,
  Lock,
  PlusCircle,
  DollarSign,
  Activity,
  Users,
  Briefcase
} from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [userRes, summaryRes] = await Promise.all([
          fetch("/api/auth/me").catch(() => null),
          fetch("/api/dashboard/summary").catch(() => null),
        ]);
        const userData = userRes?.ok ? await userRes.json() : null;
        const summaryData = summaryRes?.ok ? await summaryRes.json() : null;

        if (userData?.user) {
          setUser(userData.user);
        }
        setSummary(summaryData);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <AppShell>
        <div className="space-y-6 animate-pulse">
          <div className="h-44 bg-slate-200/80 rounded-2xl"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-28 bg-slate-200/80 rounded-2xl"></div>
            <div className="h-28 bg-slate-200/80 rounded-2xl"></div>
            <div className="h-28 bg-slate-200/80 rounded-2xl"></div>
            <div className="h-28 bg-slate-200/80 rounded-2xl"></div>
          </div>
          <div className="h-96 bg-slate-200/80 rounded-2xl"></div>
        </div>
      </AppShell>
    );
  }

  const role = user?.role || "importer";

  // -------------------------------------------------------------
  // VIEW A: ADMINISTRATOR DASHBOARD (Matching Reference Image 3)
  // -------------------------------------------------------------
  if (role === "admin") {
    return (
      <AppShell>
        <div className="space-y-6">
          {/* Welcome Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-extrabold text-slate-900">
              Welcome back, {user?.fullName || "Oliver"}! 👋
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                Administrator
              </span>
              <span className="text-xs text-slate-500">Platform Health: 100% Operational</span>
            </div>
          </div>

          {/* Top 3 Metric Cards (Matching Image 3) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Metric 1 */}
            <div className="bg-gradient-to-br from-[#0c4033] to-[#072a22] text-white p-5 rounded-2xl shadow-sm border border-emerald-800/40 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-emerald-300 font-medium">
                <span>Total platform revenue</span>
                <span className="text-[11px] bg-emerald-950/60 px-2 py-0.5 rounded-md text-emerald-200">Last 30 days</span>
              </div>
              <div className="my-3">
                <div className="text-3xl font-extrabold tracking-tight">$182,320</div>
                <div className="text-xs text-emerald-300 mt-1 flex items-center gap-1 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" /> +2.87% <span className="text-slate-300 font-normal">vs last month</span>
                </div>
              </div>
              <div className="pt-2 border-t border-emerald-800/50 flex items-center justify-between text-[11px] text-emerald-200">
                <div className="w-24 h-1.5 bg-emerald-950 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-emerald-400 rounded-full" />
                </div>
                <span>+$2,749 today</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/90 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Active jobs</span>
                <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded-md text-slate-600">Last 30 days</span>
              </div>
              <div className="my-3">
                <div className="text-3xl font-extrabold tracking-tight text-slate-900">86</div>
                <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" /> +40.93% <span className="text-slate-400 font-normal">vs last month</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-end gap-1 h-4">
                  <div className="w-1.5 h-2 bg-emerald-300 rounded-xs" />
                  <div className="w-1.5 h-3 bg-emerald-400 rounded-xs" />
                  <div className="w-1.5 h-2.5 bg-emerald-300 rounded-xs" />
                  <div className="w-1.5 h-4 bg-emerald-500 rounded-xs" />
                  <div className="w-1.5 h-3 bg-emerald-400 rounded-xs" />
                </div>
                <span>Increase in active jobs +12</span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/90 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Active shippers</span>
                <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded-md text-slate-600">Last 30 days</span>
              </div>
              <div className="my-3">
                <div className="text-3xl font-extrabold tracking-tight text-slate-900">78</div>
                <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" /> +12.83% <span className="text-slate-400 font-normal">vs last month</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-2/3 h-full bg-emerald-500 rounded-full" />
                </div>
                <span>+$2,749 today</span>
              </div>
            </div>
          </div>

          {/* Revenue Chart & Notifications Grid (Matching Image 3) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8 Cols: Total Revenue Breakdown & Streams Table */}
            <div className="lg:col-span-8 space-y-6">
              {/* Chart Card */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div>
                    <span className="text-xs text-slate-500 font-medium">Total revenue</span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-3xl font-extrabold text-slate-900">$183,320</span>
                      <span className="text-xs font-bold text-emerald-600 flex items-center">
                        <TrendingUp className="w-3.5 h-3.5" /> +40.93%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-xs text-slate-600">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-slate-500">Insurance revenue</span>
                      </div>
                      <div className="font-extrabold text-slate-900 text-sm mt-0.5">
                        $100,000 <span className="text-[10px] text-emerald-600 font-semibold">+2.87%</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-slate-800" />
                        <span className="text-slate-500">Fuel program revenue</span>
                      </div>
                      <div className="font-extrabold text-slate-900 text-sm mt-0.5">
                        $24,628 <span className="text-[10px] text-red-600 font-semibold">-9.24%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Monthly Bar Chart Graphic */}
                <div className="pt-6">
                  <div className="h-44 flex items-end justify-between gap-4 px-2">
                    {[
                      { month: "Jan", height: "45%" },
                      { month: "Feb", height: "65%" },
                      { month: "Mar", height: "80%" },
                      { month: "Apr", height: "95%" },
                      { month: "May", height: "55%" },
                      { month: "Jun", height: "75%" },
                    ].map((bar) => (
                      <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <div
                          style={{ height: bar.height }}
                          className="w-full max-w-[48px] bg-emerald-500 hover:bg-emerald-600 rounded-t-lg transition shadow-xs"
                        />
                        <span className="text-[11px] font-semibold text-slate-500">{bar.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Revenue Streams Table */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    Revenue streams table
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search..."
                        className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 outline-none w-36"
                      />
                    </div>
                    <button className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600">
                      <Filter className="w-3 h-3" /> Filters
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Source</th>
                        <th className="py-3 px-4">Revenue</th>
                        <th className="py-3 px-4">Spread %</th>
                        <th className="py-3 px-4">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                          <Truck className="w-4 h-4 text-emerald-600" /> Jobs
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">$92,300</td>
                        <td className="py-3 px-4 text-slate-600">10-15%</td>
                        <td className="py-3 px-4 text-slate-500">Primary corridor dispatch</td>
                      </tr>
                      <tr className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                          <Handshake className="w-4 h-4 text-emerald-600" /> Direct Deals
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">$38,500</td>
                        <td className="py-3 px-4 text-slate-600">~8%</td>
                        <td className="py-3 px-4 text-slate-500">Manual assignment</td>
                      </tr>
                      <tr className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                          <Handshake className="w-4 h-4 text-emerald-600" /> Direct Deals
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">$38,500</td>
                        <td className="py-3 px-4 text-slate-600">~8%</td>
                        <td className="py-3 px-4 text-slate-500">Manual assignment</td>
                      </tr>
                      <tr className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                          <Handshake className="w-4 h-4 text-emerald-600" /> Direct Deals
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">$38,500</td>
                        <td className="py-3 px-4 text-slate-600">~8%</td>
                        <td className="py-3 px-4 text-slate-500">Manual assignment</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Notifications Panel matching Image 3 */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900">Notifications</h3>
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center">
                    12
                  </span>
                </div>
                <button className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700">
                  <Check className="w-3.5 h-3.5" /> Read all
                </button>
              </div>

              {/* Notification 1: Compliance */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold px-2 py-0.5 rounded bg-red-100 text-red-700 uppercase tracking-wider">
                    COMPLIANCE
                  </span>
                  <span className="text-slate-400">Just now</span>
                </div>
                <div className="text-xs font-bold text-slate-900">3 jobs missing CVIs</div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Verification records pending compliance review at Taftan terminal.
                </p>
                <Link
                  href="/admin/verification"
                  className="block text-center w-full py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-800 transition"
                >
                  Review jobs
                </Link>
              </div>

              {/* Notification 2: Spread Margin */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 uppercase tracking-wider">
                    SPREAD MARGIN
                  </span>
                  <span className="text-slate-400">3 min ago</span>
                </div>
                <div className="text-xs font-bold text-slate-900">Carrier payout too high on Job #1482</div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Adjust margin rules for refrigerated fuel surcharge.
                </p>
                <button className="w-full py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-800 transition">
                  Adjust spread
                </button>
              </div>

              {/* Notification 3: Integration */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase tracking-wider">
                    INTEGRATION
                  </span>
                  <span className="text-slate-400">13 min ago</span>
                </div>
                <div className="text-xs font-bold text-slate-900">GPS system for &quot;HaulPro&quot; failing</div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  WebRTC telemetry sync interrupted at Chaman border tower.
                </p>
                <button className="w-full py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-800 transition">
                  Reconnect
                </button>
              </div>

              {/* Notification 4: Payout */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold px-2 py-0.5 rounded bg-red-100 text-red-700 uppercase tracking-wider">
                    PAYOUT FAILED
                  </span>
                  <span className="text-slate-400">1d ago</span>
                </div>
                <div className="text-xs font-bold text-slate-900">$2,200 to carrier delayed</div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Bank transit routing code requires merchant verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  // ----------------------------------------------------------------------------------
  // VIEW B: TRADER DASHBOARDS (Importer, Exporter, Driver matching Reference Image 1)
  // ----------------------------------------------------------------------------------
  return (
    <AppShell>
      <div className="space-y-6">
        {/* 1. Hero Trade Banner matching Image 1 */}
        <div className="relative rounded-2xl overflow-hidden shadow-md text-white bg-[#0A1A2E]">
          {/* Mountain Truck Highway Background Image with Gradient Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/mountain-truck-highway.jpg"
              alt="Trade Corridor Transport"
              className="w-full h-full object-cover object-center brightness-75 contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#061424]/95 via-[#081a2e]/85 to-[#0b243e]/70" />
          </div>

          <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left Content */}
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Bridging Markets <br />
                Across <span className="text-emerald-400">Borders</span>
              </h1>

              <p className="mt-3 text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl font-normal">
                Connect. Trade. Grow. BorderGlow empowers businesses across <span className="text-white font-semibold">Pakistan, Iran and Afghanistan</span> with secure, trusted and efficient trade solutions.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  href="/marketplace"
                  className="inline-flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/25 transition transform hover:-translate-y-0.5"
                >
                  Explore Marketplace
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-700/60 backdrop-blur-xs flex items-center gap-1.5">
                    🇵🇰 Pakistan
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-700/60 backdrop-blur-xs flex items-center gap-1.5">
                    🇮🇷 Iran
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-700/60 backdrop-blur-xs flex items-center gap-1.5">
                    🇦🇫 Afghanistan
                  </span>
                </div>
              </div>
            </div>

            {/* Right Total Trade Value Card matching Image 1 */}
            <div className="bg-[#0b1e32]/85 backdrop-blur-md border border-slate-700/60 rounded-2xl p-5 sm:p-6 lg:w-72 shrink-0 shadow-xl">
              <div className="text-[11px] font-medium text-slate-300">Total Trade Value</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
                $ 2,480,000
              </div>
              <div className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>↑ 12%</span>
                <span className="text-slate-400 font-normal">vs. last 30 days</span>
              </div>

              {/* Sparkline Graphic */}
              <div className="mt-4 h-10 w-full">
                <svg viewBox="0 0 100 30" fill="none" className="w-full h-full">
                  <path
                    d="M0 25 Q 15 20, 30 22 T 60 12 T 80 16 T 100 4"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M0 25 Q 15 20, 30 22 T 60 12 T 80 16 T 100 4 L 100 30 L 0 30 Z"
                    fill="url(#sparkline-grad-front)"
                    opacity="0.3"
                  />
                  <defs>
                    <linearGradient id="sparkline-grad-front" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Four Key Metric Cards matching Image 1 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Active Deals */}
          <Link
            href="/conversations"
            className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Handshake className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Deals</span>
            </div>
            <div className="mt-4">
              <div className="text-xs text-slate-500 font-medium">Active Deals</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">12</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <span>↑ 3 new this week</span>
              </div>
            </div>
          </Link>

          {/* Card 2: Open Shipments */}
          <Link
            href="/shipments"
            className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Transit</span>
            </div>
            <div className="mt-4">
              <div className="text-xs text-slate-500 font-medium">Open Shipments</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">8</div>
              <div className="text-[11px] text-blue-600 font-semibold mt-1 flex items-center gap-1">
                <span>⚓ In transit</span>
              </div>
            </div>
          </Link>

          {/* Card 3: Pending Verifications */}
          <Link
            href="/verification"
            className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Trust</span>
            </div>
            <div className="mt-4">
              <div className="text-xs text-slate-500 font-medium">Pending Verifications</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">4</div>
              <div className="text-[11px] text-teal-600 font-semibold mt-1 flex items-center gap-1">
                <span>✓ Review required</span>
              </div>
            </div>
          </Link>

          {/* Card 4: Messages */}
          <Link
            href="/conversations"
            className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Chat</span>
            </div>
            <div className="mt-4">
              <div className="text-xs text-slate-500 font-medium">Messages</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">5</div>
              <div className="text-[11px] text-purple-600 font-semibold mt-1 flex items-center gap-1">
                <span>💬 3 unread</span>
              </div>
            </div>
          </Link>
        </div>

        {/* 3. Middle Multi-Column Grid matching Image 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols): Recent Activity + Map + Quick Actions */}
          <div className="lg:col-span-8 space-y-6">
            {/* Recent Trade Activity Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                  Recent Trade Activity
                </h3>
                <Link
                  href="/conversations"
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                {[
                  {
                    title: "Steel Products Deal",
                    type: "Importer • UAE → Pakistan",
                    amount: "$ 125,000",
                    volume: "20 tons",
                    time: "2h ago",
                    status: "Active",
                    statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    icon: Package
                  },
                  {
                    title: "Textile Shipment",
                    type: "Exporter • Pakistan → Iran",
                    amount: "$ 48,000",
                    volume: "5 tons",
                    time: "4h ago",
                    status: "In Transit",
                    statusColor: "bg-blue-50 text-blue-700 border-blue-200",
                    icon: Truck
                  },
                  {
                    title: "Trucking Service",
                    type: "Driver • Pakistan (Lahore → Islamabad)",
                    amount: "$ 2,400",
                    volume: "Reefer FTL",
                    time: "6h ago",
                    status: "Assigned",
                    statusColor: "bg-purple-50 text-purple-700 border-purple-200",
                    icon: Compass
                  },
                  {
                    title: "Agricultural Products",
                    type: "Importer • Afghanistan",
                    amount: "$ 32,000",
                    volume: "10 tons",
                    time: "8h ago",
                    status: "Active",
                    statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    icon: ShoppingBag
                  },
                  {
                    title: "Machinery Deal",
                    type: "Exporter • Iran → Pakistan",
                    amount: "$ 210,000",
                    volume: "15 tons",
                    time: "12h ago",
                    status: "Negotiation",
                    statusColor: "bg-amber-50 text-amber-700 border-amber-200",
                    icon: Briefcase
                  }
                ].map((deal, i) => {
                  const Icon = deal.icon;
                  return (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                            {deal.title}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                            {deal.type}
                          </div>
                          <div className="text-[11px] text-slate-700 font-semibold mt-0.5">
                            {deal.amount} • <span className="text-slate-500 font-normal">{deal.volume}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${deal.statusColor}`}>
                          {deal.status}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1">{deal.time}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Trade Routes (Live) Map Visual matching Image 1 */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                    Trade Routes
                  </h3>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                  </span>
                </div>
              </div>

              {/* Graphic Map Canvas */}
              <div className="relative h-60 bg-gradient-to-br from-emerald-950/5 via-slate-50 to-teal-950/10 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center p-4">
                <svg viewBox="0 0 600 240" fill="none" className="w-full h-full">
                  {/* Iran Territory Outline Representation */}
                  <path d="M 50 140 Q 120 70, 200 120 T 300 130" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />
                  {/* Afghanistan Territory */}
                  <path d="M 280 70 Q 360 40, 440 90 T 480 130" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />
                  {/* Pakistan Territory */}
                  <path d="M 320 160 Q 420 180, 520 190 T 560 140" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />

                  {/* Active Transit Curves */}
                  {/* Zahedan -> Taftan -> Quetta */}
                  <path d="M 120 120 Q 220 80, 340 140" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                  {/* Quetta -> Chaman -> Kandahar */}
                  <path d="M 340 140 Q 380 90, 420 80" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 4" />
                  {/* Taftan -> Karachi */}
                  <path d="M 340 140 Q 400 190, 480 200" stroke="#a855f7" strokeWidth="2.5" strokeDasharray="2 2" />

                  {/* Node Pins */}
                  {/* Zahedan / Iran */}
                  <circle cx="120" cy="120" r="6" fill="#10b981" />
                  <circle cx="120" cy="120" r="10" stroke="#10b981" strokeWidth="1.5" opacity="0.4" />
                  <text x="100" y="145" fill="#0f172a" fontSize="12" fontWeight="bold">Iran (Zahedan)</text>

                  {/* Taftan / Quetta / Pakistan */}
                  <circle cx="340" cy="140" r="6" fill="#10b981" />
                  <circle cx="340" cy="140" r="12" stroke="#10b981" strokeWidth="1.5" opacity="0.4" />
                  <text x="360" y="150" fill="#0f172a" fontSize="12" fontWeight="bold">Pakistan (Quetta / Taftan)</text>

                  {/* Kandahar / Afghanistan */}
                  <circle cx="420" cy="80" r="6" fill="#3b82f6" />
                  <text x="435" y="80" fill="#0f172a" fontSize="12" fontWeight="bold">Afghanistan (Kandahar)</text>
                </svg>

                {/* Map Legend */}
                <div className="absolute bottom-3 left-4 flex items-center gap-4 text-[10px] font-semibold text-slate-600 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Active Deals
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" /> In Transit
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500" /> Planned
                  </div>
                </div>
              </div>

              {/* Quick Actions Grid matching Image 1 */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3">
                  Quick Actions
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {role === "exporter" ? (
                    <Link
                      href="/products?action=new"
                      className="p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition flex flex-col items-center text-center group"
                    >
                      <PlusCircle className="w-5 h-5 text-emerald-600 mb-1.5 group-hover:scale-110 transition" />
                      <span className="font-bold text-xs text-slate-800">Post a Product</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">List for global buyers</span>
                    </Link>
                  ) : (
                    <Link
                      href="/demands"
                      className="p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition flex flex-col items-center text-center group"
                    >
                      <ShoppingBag className="w-5 h-5 text-emerald-600 mb-1.5 group-hover:scale-110 transition" />
                      <span className="font-bold text-xs text-slate-800">Post a Demand</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Find products you need</span>
                    </Link>
                  )}

                  <Link
                    href="/transport"
                    className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition flex flex-col items-center text-center group"
                  >
                    <Truck className="w-5 h-5 text-blue-600 mb-1.5 group-hover:scale-110 transition" />
                    <span className="font-bold text-xs text-slate-800">Book a Truck</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Transport goods safely</span>
                  </Link>

                  <Link
                    href="/conversations"
                    className="p-3 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/40 transition flex flex-col items-center text-center group"
                  >
                    <PhoneCall className="w-5 h-5 text-purple-600 mb-1.5 group-hover:scale-110 transition" />
                    <span className="font-bold text-xs text-slate-800">Start a Call</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Connect with partner</span>
                  </Link>

                  <Link
                    href="/verification"
                    className="p-3 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/40 transition flex flex-col items-center text-center group"
                  >
                    <ShieldCheck className="w-5 h-5 text-teal-600 mb-1.5 group-hover:scale-110 transition" />
                    <span className="font-bold text-xs text-slate-800">Verify Account</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Upload trade credentials</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Your Trade Network + Quick Call + Latest Updates */}
          <div className="lg:col-span-4 space-y-6">
            {/* Your Trade Network matching Image 1 */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-sm text-slate-900">
                  Your Trade Network
                </h3>
                <Link
                  href="/conversations"
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                {[
                  { name: "Ali Raza", role: "Exporter", country: "Pakistan", status: "Online", online: true },
                  { name: "Saeed Ahmad", role: "Importer", country: "Iran", status: "Online", online: true },
                  { name: "Farhad Rahimi", role: "Transporter", country: "Iran", status: "Last seen 2h ago", online: false },
                  { name: "Rashid Khan", role: "Driver", country: "Afghanistan", status: "Online", online: true },
                ].map((trader, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                        {trader.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">{trader.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {trader.role} • {trader.country}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-medium flex items-center gap-1 ${trader.online ? "text-emerald-600" : "text-slate-400"}`}>
                        {trader.online && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                        {trader.status}
                      </span>
                      <Link
                        href="/conversations"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Call Card matching Image 1 */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xs text-white p-5 bg-[#0C1D2E]">
              <div className="absolute inset-0 z-0 opacity-40">
                <img
                  src="/images/mountain-truck-highway.jpg"
                  alt="Transit Highway"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-white">Quick Call</h4>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Start a secure voice or video call with your deal partner.
                </p>
                <Link
                  href="/conversations"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#059669] hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition"
                >
                  <Video className="w-4 h-4" />
                  Start Call
                </Link>
              </div>
            </div>

            {/* Latest Updates Card matching Image 1 */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-sm text-slate-900">
                  Latest Updates
                </h3>
                <Link
                  href="/news"
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 leading-snug">
                      New compliance guidelines for cross-border trade
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">2 hours ago</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 leading-snug">
                      Market prices for steel increased by 8%
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">5 hours ago</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 leading-snug">
                      System maintenance scheduled (Jan 18, 2:00 AM)
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">1 day ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Bottom Cyber Security Banner matching Image 1 */}
        <div className="bg-gradient-to-r from-[#072420] via-[#09352e] to-[#041a17] text-white rounded-2xl p-5 sm:p-6 border border-emerald-500/30 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base text-white">
                Secure. Verified. Trusted.
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
                Our multi-layer security ensures your data, transactions and communications are protected across borders.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => setShowVerificationModal(true)}
              className="inline-flex items-center gap-1.5 bg-emerald-400/20 hover:bg-emerald-400/30 text-emerald-300 hover:text-white px-4 py-2 rounded-xl text-xs font-bold border border-emerald-400/30 transition cursor-pointer"
            >
              Learn More <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
