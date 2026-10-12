"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge, TrustShield } from "@/components/ui/StatusBadge";
import {
  User,
  MapPin,
  Calendar,
  Building,
  ShieldCheck,
  Package,
  FileText,
  Truck,
  MessageSquare,
  Lock
} from "lucide-react";

export default function ProfilePage() {
  const params = useParams();
  const userId = params?.id;

  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/profiles/${userId}`);
        const data = await res.json();
        setProfileData(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <AppShell>
        <div className="h-64 bg-white rounded-xl border border-slate-200 animate-pulse"></div>
      </AppShell>
    );
  }

  const user = profileData?.user;
  if (!user) {
    return (
      <AppShell>
        <div className="bg-white rounded-xl p-8 text-center text-sm text-slate-500">
          User profile not found.
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Profile Header Card */}
        <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#142B4A] to-blue-800 text-white flex items-center justify-center font-extrabold text-2xl shadow-sm">
                {user.fullName.charAt(0)}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-[#142B4A]">{user.fullName}</h1>
                  <StatusBadge status={user.verificationStatus} size="sm" />
                </div>

                <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2 mt-1">
                  <span className="font-semibold text-slate-700 capitalize">{user.role}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {user.city}, {user.country}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    {user.businessName || "Registered Trade Merchant"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/conversations?newDeal=general&targetUserId=${user.id}&title=${encodeURIComponent(`Direct Inquiry: ${user.fullName}`)}`}
                className="inline-flex items-center gap-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-xs transition"
              >
                <MessageSquare className="w-4 h-4" />
                Initiate Deal Discussion
              </Link>
            </div>
          </div>

          {user.bio && (
            <p className="text-xs text-slate-600 mt-4 pt-4 border-t border-slate-100 leading-relaxed max-w-3xl">
              {user.bio}
            </p>
          )}
        </div>

        {/* Public Privacy Assurance */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center gap-3 text-xs text-slate-500">
          <Lock className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            <strong>Verified Public Safe Profile:</strong> Private tax numbers, original government CNIC/passport scans, and private banking coordinates remain confidential per BorderGlow privacy architecture.
          </span>
        </div>

        {/* Offerings by User */}
        <div>
          <h3 className="font-bold text-sm text-[#142B4A] mb-3">
            Active Catalog & Corridor Offerings ({user.role})
          </h3>

          {user.role === "exporter" && (
            profileData.products && profileData.products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profileData.products.map((p: any) => (
                  <div key={p.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                    <div className="text-[10px] font-bold text-blue-600 uppercase mb-1">{p.category}</div>
                    <div className="font-bold text-xs text-[#142B4A]">{p.title}</div>
                    <div className="text-xs text-slate-500 mt-1">Avail: {p.quantityAvailable} {p.unit}</div>
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="font-extrabold text-[#142B4A]">${p.pricePerUnit}</span>
                      <Link
                        href={`/conversations?newDeal=product&id=${p.id}&targetUserId=${user.id}&title=${encodeURIComponent(p.title)}`}
                        className="text-xs text-blue-600 font-semibold hover:underline"
                      >
                        Send Inquiry →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-xs text-slate-400">
                No active export products currently listed.
              </div>
            )
          )}

          {user.role === "importer" && (
            profileData.demands && profileData.demands.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profileData.demands.map((d: any) => (
                  <div key={d.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                    <div className="text-[10px] font-bold text-blue-600 uppercase mb-1">RFQ: {d.category}</div>
                    <div className="font-bold text-xs text-[#142B4A]">{d.title}</div>
                    <div className="text-xs text-slate-500 mt-1">Target: {d.quantityRequired} {d.unit}</div>
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="font-extrabold text-emerald-700">${d.targetPrice || "Negotiable"}</span>
                      <Link
                        href={`/conversations?newDeal=demand&id=${d.id}&targetUserId=${user.id}&title=${encodeURIComponent(d.title)}`}
                        className="text-xs text-blue-600 font-semibold hover:underline"
                      >
                        Quote Terms →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-xs text-slate-400">
                No active purchase demands currently posted.
              </div>
            )
          )}

          {user.role === "driver" && (
            profileData.offers && profileData.offers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profileData.offers.map((o: any) => (
                  <div key={o.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                    <div className="font-bold text-xs text-[#142B4A]">{o.title}</div>
                    <div className="text-xs text-blue-900 font-medium mt-1">{o.originCorridor} → {o.destinationCorridor}</div>
                    <div className="text-xs text-slate-500 mt-1">Payload: {o.availableCapacityTons} MT</div>
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="font-extrabold text-[#142B4A]">${o.ratePerKmOrTrip} ({o.pricingUnit})</span>
                      <Link
                        href={`/conversations?newDeal=transport&id=${o.id}&targetUserId=${user.id}&title=${encodeURIComponent(o.title)}`}
                        className="text-xs text-blue-600 font-semibold hover:underline"
                      >
                        Request Haulage →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-xs text-slate-400">
                No active transport offers currently posted.
              </div>
            )
          )}
        </div>
      </div>
    </AppShell>
  );
}
