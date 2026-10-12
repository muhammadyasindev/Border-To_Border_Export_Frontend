import React from "react";
import { CheckCircle2, Clock, AlertTriangle, XCircle, ShieldCheck } from "lucide-react";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const norm = (status || "").toLowerCase().trim();
  const px = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs";

  if (norm === "verified" || norm === "active" || norm === "delivered" || norm === "approved") {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 ${px}`}>
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        {norm === "verified" ? "Verified" : norm === "active" ? "Active" : norm === "delivered" ? "Delivered" : "Approved"}
      </span>
    );
  }

  if (norm === "pending_review" || norm === "submitted" || norm === "in_transit" || norm === "in_transit_to_border" || norm === "booked") {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded-md bg-amber-50 text-amber-800 border border-amber-200 ${px}`}>
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        {norm === "pending_review" ? "Pending Review" : norm.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
      </span>
    );
  }

  if (norm === "changes_required") {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded-md bg-orange-50 text-orange-800 border border-orange-200 ${px}`}>
        <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
        Changes Required
      </span>
    );
  }

  if (norm === "rejected" || norm === "cancelled") {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded-md bg-rose-50 text-rose-800 border border-rose-200 ${px}`}>
        <XCircle className="w-3.5 h-3.5 text-rose-600" />
        {norm.charAt(0).toUpperCase() + norm.slice(1)}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-md bg-slate-100 text-slate-700 border border-slate-200 ${px}`}>
      {status ? status.replace(/_/g, " ") : "Not Submitted"}
    </span>
  );
}

export function TrustShield({ verified }: { verified: boolean }) {
  if (!verified) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200" title="Business verification pending or unverified">
        Unverified
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200" title="Verified Trade Business">
      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
      Verified Business
    </span>
  );
}
