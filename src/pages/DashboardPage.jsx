import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AppShell } from "../components/layout/AppShell.jsx";
import {
  Package,
  ShoppingBag,
  Truck,
  MessageSquare,
  Compass,
  ArrowRight,
  TrendingUp,
  Video,
  ShieldCheck,
  PhoneCall,
  Search,
  Check,
  ChevronRight,
  Handshake,
  Clock,
  Lock,
  PlusCircle,
  AlertCircle,
  UserCheck
} from "lucide-react";
import { safeFetch } from "../lib/api.js";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [userRes, summaryRes] = await Promise.all([
          safeFetch("/api/auth/me").catch(() => null),
          safeFetch("/api/dashboard/summary").catch(() => null),
        ]);
        if (userRes?.ok && userRes.data?.user) {
          setUser(userRes.data.user);
        }
        if (summaryRes?.ok && summaryRes.data) {
          setSummary(summaryRes.data);
        }
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
          <div className="h-44 bg-slate-200/80 rounded-2xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-28 bg-slate-200/80 rounded-2xl" />
            <div className="h-28 bg-slate-200/80 rounded-2xl" />
            <div className="h-28 bg-slate-200/80 rounded-2xl" />
            <div className="h-28 bg-slate-200/80 rounded-2xl" />
          </div>
          <div className="h-96 bg-slate-200/80 rounded-2xl" />
        </div>
      </AppShell>
    );
  }

  const role = user?.role || "importer";
  const metrics = summary?.metrics || {};

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Verification Alert Banner if Not Verified */}
        {user?.verificationStatus !== "verified" && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-amber-950">
                  {user?.verificationStatus === "pending_review"
                    ? "Verification Under Review"
                    : "Complete Your Corridor Verification"}
                </h4>
                <p className="text-xs text-amber-800 mt-0.5">
                  {user?.verificationStatus === "pending_review"
                    ? "Your identity and compliance documents have been submitted and are being reviewed by authorized customs officers."
                    : "Upload your CNIC, trade enterprise license, or driving documents in the Verification Center to unlock private deal rooms and verified trader shield."}
                </p>
              </div>
            </div>
            <Link
              to="/verification"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition shrink-0 flex items-center gap-1.5 self-start sm:self-center"
            >
              <span>{user?.verificationStatus === "pending_review" ? "View Status" : "Upload CNIC & Documents"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* 1. Hero Trade Banner with Real Data */}
        <div className="relative rounded-2xl overflow-hidden shadow-md text-white bg-[#0A1A2E]">
          <div className="absolute inset-0 z-0">
            <img
              src="/images/mountain-truck-highway.jpg"
              alt="Trade Corridor Transport"
              className="w-full h-full object-cover object-center brightness-75 contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#061424]/95 via-[#081a2e]/85 to-[#0b243e]/70" />
          </div>

          <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Logged in as: <strong className="text-white uppercase">{role}</strong> ({user?.fullName || user?.email})</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Bridging Markets <br />
                Across <span className="text-emerald-400">Borders</span>
              </h1>
              <p className="mt-3 text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl font-normal">
                Connect. Trade. Grow. BorderGlow empowers businesses across <span className="text-white font-semibold">Pakistan, Iran and Afghanistan</span> with secure, trusted and efficient trade solutions.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  to="/marketplace"
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

            {/* Real Dynamic Trade Volume Card */}
            <div className="bg-[#0b1e32]/85 backdrop-blur-md border border-slate-700/60 rounded-2xl p-5 sm:p-6 lg:w-72 shrink-0 shadow-xl">
              <div className="text-[11px] font-medium text-slate-300">Total Trade Value</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
                $ {Number(metrics?.totalTradeValue || 0).toLocaleString()}
              </div>
              <div className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{metrics?.totalTradeValue ? "Active Volume" : "Corridor Ready"}</span>
                <span className="text-slate-400 font-normal">Real-time ledger</span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-300">
                <span>Active Deals:</span>
                <span className="font-bold text-white">{metrics?.openDeals ?? 0}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-slate-300">
                <span>Shipments in Transit:</span>
                <span className="font-bold text-emerald-400">{metrics?.activeShipments ?? metrics?.activeTrips ?? 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Key Metric Cards (Real Dynamic Counts) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Active Deals */}
          <Link
            to="/conversations"
            className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Handshake className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Deals</span>
            </div>
            <div className="mt-4">
              <div className="text-xs text-slate-500 font-medium">Active Deal Rooms</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {metrics?.openDeals ?? 0}
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                {metrics?.openDeals ? "Open tripartite threads" : "No open deals"}
              </div>
            </div>
          </Link>

          {/* Card 2: Shipments */}
          <Link
            to="/shipments"
            className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Transit</span>
            </div>
            <div className="mt-4">
              <div className="text-xs text-slate-500 font-medium">
                {role === "driver" ? "Active Road Trips" : "Inbound Shipments"}
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {metrics?.activeShipments ?? metrics?.activeTrips ?? 0}
              </div>
              <div className="text-[11px] text-blue-600 font-semibold mt-1">
                {metrics?.activeShipments || metrics?.activeTrips ? "⚓ Live GPS tracking" : "No active cargo transit"}
              </div>
            </div>
          </Link>

          {/* Card 3: Verification Status */}
          <Link
            to="/verification"
            className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                user?.verificationStatus === "verified"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-amber-50 text-amber-600"
              }`}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Trust</span>
            </div>
            <div className="mt-4">
              <div className="text-xs text-slate-500 font-medium">Verification Status</div>
              <div className="text-base sm:text-lg font-extrabold text-slate-900 mt-1 capitalize truncate">
                {user?.verificationStatus === "verified"
                  ? "Verified Trader"
                  : user?.verificationStatus === "pending_review"
                  ? "Pending Review"
                  : "Not Submitted"}
              </div>
              <div className={`text-[11px] font-semibold mt-1 ${
                user?.verificationStatus === "verified" ? "text-emerald-600" : "text-amber-600"
              }`}>
                {user?.verificationStatus === "verified" ? "✓ Verified Badge Active" : "Upload CNIC & Docs →"}
              </div>
            </div>
          </Link>

          {/* Card 4: Messages & Communications */}
          <Link
            to="/conversations"
            className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Chat & Calls</span>
            </div>
            <div className="mt-4">
              <div className="text-xs text-slate-500 font-medium">Messages & Call Rooms</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {summary?.myConversations?.length ?? 0}
              </div>
              <div className="text-[11px] text-purple-600 font-semibold mt-1">
                💬 WebRTC Audio/Video ready
              </div>
            </div>
          </Link>
        </div>

        {/* 3. Main Role-Tailored Feed: Demands, Products & Transport */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols): Role Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* EXPORTER VIEW: Demands from Importers/Drivers to Fulfill */}
            {role === "exporter" && (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">
                      Live Buyer Demands (Corridor Importers)
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Demands published by buyers in Pakistan, Iran, and Afghanistan looking for commodities.
                    </p>
                  </div>
                  <Link
                    to="/marketplace?tab=demands"
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 shrink-0"
                  >
                    View All Demands <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {summary?.marketplaceDemands && summary.marketplaceDemands.length > 0 ? (
                  <div className="space-y-3">
                    {summary.marketplaceDemands.map((demand) => (
                      <div
                        key={demand._id || demand.id}
                        className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <ShoppingBag className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                              {demand.title}
                            </h4>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Destination: <strong>{demand.destinationCountry || "Pakistan"}</strong> ({demand.destinationCity || "Hub"}) • Category: {demand.category || "Commodity"}
                            </div>
                            <div className="text-[11px] text-slate-700 font-semibold mt-1">
                              Quantity: {demand.quantityRequired || demand.quantity || "Bulk"} {demand.unit || "Tons"}
                              {demand.targetPrice && ` • Target Price: $${Number(demand.targetPrice).toLocaleString()}`}
                            </div>
                          </div>
                        </div>

                        <Link
                          to={`/conversations?newDeal=demand&id=${demand._id || demand.id}&title=${encodeURIComponent(demand.title)}&targetUserId=${demand.buyerId || ""}`}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition shrink-0 self-start sm:self-center flex items-center gap-1.5"
                        >
                          <Handshake className="w-3.5 h-3.5" />
                          <span>Supply / Deal Room</span>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-600 font-medium">
                      No active buyer demands published in the corridor right now.
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      As an Exporter, you can list your export commodities in the Marketplace so regional importers can find and contact you.
                    </p>
                    <Link
                      to="/products?action=new"
                      className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Post Product for Export</span>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* IMPORTER VIEW: Products in Marketplace & Transport Offers */}
            {role === "importer" && (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">
                      Available Commodities in Corridor Marketplace
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Verified export commodities available from Pakistan, Iran, and Afghanistan producers.
                    </p>
                  </div>
                  <Link
                    to="/marketplace?tab=products"
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 shrink-0"
                  >
                    Browse All Products <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {summary?.marketplaceProducts && summary.marketplaceProducts.length > 0 ? (
                  <div className="space-y-3">
                    {summary.marketplaceProducts.map((prod) => (
                      <div
                        key={prod._id || prod.id}
                        className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <Package className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                              {prod.title}
                            </h4>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Origin: <strong>{prod.originCountry || "Pakistan"}</strong> ({prod.originCity || "Hub"}) • Category: {prod.category || "General"}
                            </div>
                            <div className="text-[11px] text-slate-700 font-semibold mt-1">
                              Price: ${Number(prod.pricePerUnit || prod.price || 0).toLocaleString()} / {prod.unit || "unit"}
                            </div>
                          </div>
                        </div>

                        <Link
                          to={`/conversations?newDeal=product&id=${prod._id || prod.id}&title=${encodeURIComponent(prod.title)}&targetUserId=${prod.exporterId || ""}`}
                          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition shrink-0 self-start sm:self-center flex items-center gap-1.5"
                        >
                          <Handshake className="w-3.5 h-3.5" />
                          <span>Inquire & Buy</span>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-600 font-medium">
                      No products listed in the marketplace yet.
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Post what goods you need so producers and exporters can quote prices directly to you.
                    </p>
                    <Link
                      to="/demands?action=new"
                      className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Post a Buyer Demand</span>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* DRIVER VIEW: Cargo Transport Requests & Haulage Opportunities */}
            {role === "driver" && (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">
                      Open Freight Demands (Haulage Opportunities)
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Commercial shipments requiring road transport across corridor transit routes.
                    </p>
                  </div>
                  <Link
                    to="/marketplace?tab=transport"
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 shrink-0"
                  >
                    Transport Marketplace <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {summary?.availableDemands && summary.availableDemands.length > 0 ? (
                  <div className="space-y-3">
                    {summary.availableDemands.map((demand) => (
                      <div
                        key={demand._id || demand.id}
                        className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                            <Truck className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                              {demand.title}
                            </h4>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Route: <strong>{demand.originCountry || "Origin"}</strong> ➔ <strong>{demand.destinationCountry || "Destination"}</strong>
                            </div>
                            <div className="text-[11px] text-slate-700 font-semibold mt-1">
                              Cargo: {demand.quantityRequired || demand.quantity || "Full Load"} {demand.unit || "Tons"}
                            </div>
                          </div>
                        </div>

                        <Link
                          to={`/conversations?newDeal=demand&id=${demand._id || demand.id}&title=${encodeURIComponent(demand.title)}&targetUserId=${demand.buyerId || ""}`}
                          className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition shrink-0 self-start sm:self-center flex items-center gap-1.5"
                        >
                          <Compass className="w-3.5 h-3.5" />
                          <span>Offer Transport</span>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <Truck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-600 font-medium">
                      No open cargo transport requests currently.
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Register your truck and trailer in the Fleet tab to publish your route availability to traders.
                    </p>
                    <Link
                      to="/vehicles?action=new"
                      className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Register Vehicle in Fleet</span>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Real Communications / Calls / SMS History */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    My Calls & Deal Rooms History
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Your active commercial discussions, SMS messages, and WebRTC calls.
                  </p>
                </div>
                <Link
                  to="/conversations"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 shrink-0"
                >
                  Open Inbox <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {summary?.myConversations && summary.myConversations.length > 0 ? (
                <div className="space-y-2.5">
                  {summary.myConversations.map((conv) => (
                    <Link
                      key={conv._id || conv.id}
                      to={`/conversations?id=${conv._id || conv.id}`}
                      className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                            {conv.title || "Commercial Deal Room"}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Status: <span className="text-emerald-600 font-semibold">{conv.status || "active"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="p-1.5 rounded-lg text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition">
                          <PhoneCall className="w-4 h-4" />
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <MessageSquare className="w-7 h-7 text-slate-300 mx-auto mb-1.5" />
                  <p className="text-xs text-slate-600 font-medium">
                    No active call or message threads yet.
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Select a counterparty from the Marketplace to negotiate rates, share documents, or start a call.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (4 cols): Quick Corridor Shortcuts */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs">
              <h3 className="font-extrabold text-sm text-slate-900 mb-3.5">
                Corridor Quick Actions
              </h3>

              <div className="grid grid-cols-2 gap-2.5">
                {role === "exporter" ? (
                  <Link
                    to="/products?action=new"
                    className="p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition flex flex-col items-center text-center group"
                  >
                    <Package className="w-5 h-5 text-emerald-600 mb-1.5 group-hover:scale-110 transition" />
                    <span className="font-bold text-xs text-slate-800">List Product</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">For global export</span>
                  </Link>
                ) : (
                  <Link
                    to="/demands?action=new"
                    className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition flex flex-col items-center text-center group"
                  >
                    <ShoppingBag className="w-5 h-5 text-blue-600 mb-1.5 group-hover:scale-110 transition" />
                    <span className="font-bold text-xs text-slate-800">Post Demand</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Procure commodities</span>
                  </Link>
                )}

                <Link
                  to="/transport"
                  className="p-3 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/40 transition flex flex-col items-center text-center group"
                >
                  <Truck className="w-5 h-5 text-purple-600 mb-1.5 group-hover:scale-110 transition" />
                  <span className="font-bold text-xs text-slate-800">Freight Transport</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Road haulage booking</span>
                </Link>

                <Link
                  to="/conversations"
                  className="p-3 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 transition flex flex-col items-center text-center group"
                >
                  <PhoneCall className="w-5 h-5 text-amber-600 mb-1.5 group-hover:scale-110 transition" />
                  <span className="font-bold text-xs text-slate-800">Start Call</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Audio/Video Deal Room</span>
                </Link>

                <Link
                  to="/verification"
                  className="p-3 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/40 transition flex flex-col items-center text-center group"
                >
                  <ShieldCheck className="w-5 h-5 text-teal-600 mb-1.5 group-hover:scale-110 transition" />
                  <span className="font-bold text-xs text-slate-800">Verification</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Upload CNIC & Docs</span>
                </Link>
              </div>
            </div>

            {/* Quick WebRTC Call Card */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xs text-white p-5 bg-[#0C1D2E]">
              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Video className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-white">Tripartite Deal Call</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Start an encrypted peer-to-peer voice/video call with your buyer, seller, or driver.
                </p>
                <Link
                  to="/conversations"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#059669] hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition"
                >
                  <Video className="w-4 h-4" />
                  <span>Open Deal Room & Call</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
