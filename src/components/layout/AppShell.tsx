"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Handshake,
  MessageSquare,
  Truck,
  FileText,
  Video,
  ShieldCheck,
  User,
  Settings,
  Search,
  Bell,
  Headphones,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Globe2,
  MessageCircle,
  Mail,
  PhoneCall
} from "lucide-react";
import { safeFetch } from "@/lib/api";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  // Fetch current authenticated user
  const fetchUser = async () => {
    try {
      const res = await safeFetch("/api/auth/me");
      if (res.ok && res.data?.user) {
        setCurrentUser(res.data.user);
      } else {
        setCurrentUser(null);
      }
    } catch (err) {
      console.warn("User auth status check:", err);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const role = currentUser?.role || "importer";

  // Build navigation items matching Reference UI with distinct unique URLs
  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Marketplace", href: "/marketplace", icon: ShoppingBag },
    { name: "My Deals", href: "/conversations?view=deals", icon: Handshake, badge: "3" },
    { name: "Messages", href: "/conversations", icon: MessageSquare, badge: "5" },
    { name: "Shipments", href: "/shipments", icon: Truck },
    { name: "Documents", href: "/documents", icon: FileText },
    { name: "Calls & Video", href: "/conversations?view=calls", icon: Video },
    {
      name: "Compliance",
      href: role === "admin" ? "/admin/verification" : "/compliance",
      icon: ShieldCheck
    },
    { name: "Profile", href: `/profile/${currentUser?.id || 1}`, icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  // Precise active check so that multiple items NEVER turn green together
  const isItemActive = (href: string) => {
    if (href.includes("?")) {
      const [path, query] = href.split("?");
      if (typeof window !== "undefined") {
        return pathname === path && window.location.search === `?${query}`;
      }
      return false;
    }
    if (href === "/conversations") {
      if (typeof window !== "undefined" && window.location.search) {
        return false;
      }
      return pathname === "/conversations";
    }
    // Exact path matching only
    return pathname === href;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-[#0F172A] font-sans flex antialiased">
      {/* 1. Deep Navy Desktop Sidebar (Matching Image 1 Reference) */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0A1628] text-white shrink-0 border-r border-[#122238] select-none fixed inset-y-0 left-0 z-30">
        {/* Logo and Tagline */}
        <div className="p-6 pb-5 border-b border-[#132338]">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition transform">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-white leading-none">
                Border<span className="text-emerald-400">Glow</span>
              </span>
              <span className="text-[10px] tracking-wide text-slate-400 font-medium mt-1">
                Global Trade. Brighter Together.
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links (With strict single-item active highlighting) */}
        <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition group ${
                  active
                    ? "bg-[#059669] text-white shadow-md shadow-emerald-900/30 font-bold"
                    : "text-slate-300 hover:bg-[#122338] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? "text-white" : "text-slate-400 group-hover:text-emerald-400"} transition`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      active ? "bg-white text-emerald-800" : "bg-[#102a3a] text-emerald-400 border border-emerald-500/30"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Sidebar Trust Card */}
        <div className="p-4 pt-0 space-y-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#0e2738] to-[#0a1c2a] border border-teal-500/30 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Business</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
              Your account is verified and trusted in the BorderGlow network.
            </p>
            <Link
              href={`/profile/${currentUser?.id || 1}`}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 group"
            >
              View Profile
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>

          {/* Regional Corridor Tag */}
          <div className="pt-2 border-t border-[#132338] text-[10px] text-slate-400 flex flex-col gap-0.5">
            <div className="font-semibold text-slate-300">Trade Without Borders</div>
            <div>Pakistan • Iran • Afghanistan</div>
          </div>
        </div>
      </aside>

      {/* 2. Main Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200/90 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-2xs">
          {/* Left: Mobile Toggle & Global Search Input */}
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search Pill Bar */}
            <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md hidden sm:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, demands, shipments, or users..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-800 placeholder-slate-400 transition outline-none"
              />
            </form>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Notification Bell with Badge */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition relative cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-extrabold flex items-center justify-center">
                  5
                </span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 text-xs">
                  <div className="font-bold text-slate-900 mb-2 flex items-center justify-between">
                    <span>Recent Notifications</span>
                    <span className="text-[10px] text-emerald-600 font-semibold cursor-pointer">Mark read</span>
                  </div>
                  <div className="space-y-2 text-slate-600">
                    <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
                      <strong className="text-emerald-900 block">Quotation Received</strong>
                      Indus Agri submitted a new price on your Basmati demand.
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <strong className="text-slate-900 block">Shipment In Transit</strong>
                      Reefer truck crossed Taftan zero-point customs.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Support Headset Icon - Opens WhatsApp & Email Support Modal */}
            <button
              onClick={() => setSupportModalOpen(true)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition inline-flex items-center gap-1 cursor-pointer"
              title="Trade Support Desk"
            >
              <Headphones className="w-4 h-4 text-emerald-600" />
              <span className="hidden xl:inline text-xs font-semibold text-slate-600">Support</span>
            </button>

            {/* User Profile Pill */}
            <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center ring-2 ring-emerald-500/20 overflow-hidden">
                {currentUser?.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.fullName} className="w-full h-full object-cover" />
                ) : (
                  <span>{currentUser?.fullName ? currentUser.fullName.charAt(0) : "A"}</span>
                )}
              </div>

              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {currentUser?.fullName || "Ahmed Khan"}
                </span>
                <span className="text-[11px] text-slate-500 font-medium capitalize">
                  {currentUser?.role || "Importer"}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={async () => {
                  await fetch("/api/auth/logout", { method: "POST" });
                  router.push("/login");
                  router.refresh();
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition ml-1 cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Overlay Drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setSidebarOpen(false)} />
            <div className="relative w-64 bg-[#0A1628] text-white h-full shadow-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="font-extrabold text-base text-white">
                    Border<span className="text-emerald-400">Glow</span>
                  </div>
                  <button onClick={() => setSidebarOpen(false)} className="p-1 text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="mt-4 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isItemActive(item.href);
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium ${
                          active ? "bg-emerald-600 text-white font-bold" : "text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded-full text-emerald-400">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    setSupportModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg bg-emerald-700 text-white"
                >
                  <Headphones className="w-4 h-4" />
                  Direct Support
                </button>
                <button
                  onClick={async () => {
                    await fetch("/api/auth/logout", { method: "POST" });
                    router.push("/login");
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 hover:text-white"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* SUPPORT MODAL (With WhatsApp 03324042186 and Email Yasinsasoli186@gmail.com) */}
      {supportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#091524] text-white p-5 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Direct Trade Support Desk</h3>
                  <p className="text-xs text-slate-300">24/7 Bilateral Corridor Assistance</p>
                </div>
              </div>
              <button
                onClick={() => setSupportModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Need urgent help with verification, transport coordination, customs waybills, or deal rooms? Contact our direct coordinator:
              </p>

              {/* WhatsApp Support Button */}
              <a
                href="https://wa.me/923324042186"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100/70 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-emerald-950">WhatsApp Official Support</div>
                    <div className="text-[11px] font-mono text-emerald-700">03324042186 (+92 332 4042186)</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-0.5 transition" />
              </a>

              {/* Email Support Button */}
              <a
                href="mailto:Yasinsasoli186@gmail.com"
                className="flex items-center justify-between p-3.5 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100/70 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-blue-950">Email Coordinator</div>
                    <div className="text-[11px] font-mono text-blue-700">Yasinsasoli186@gmail.com</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-blue-700 group-hover:translate-x-0.5 transition" />
              </a>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSupportModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
