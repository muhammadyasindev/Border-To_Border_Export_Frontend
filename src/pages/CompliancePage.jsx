import { Link, useNavigate, useLocation, useParams, useSearchParams } from "react-router-dom";

import { AppShell } from "../components/layout/AppShell.jsx";
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  Building2,
  Truck,
  ArrowRight,
  MessageCircle,
  Mail
} from "lucide-react";
export default function ComplianceGuidePage() {
  return <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">Trade Compliance & Identity Standards</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Overview of bilateral customs, identity privacy, and verification standards across Pakistan ⇄ Iran ⇄ Afghanistan corridors.
              </p>
            </div>
          </div>
        </div>

        {
    /* Strict Document Protection Notice */
  }
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-xs text-emerald-950 space-y-2">
          <div className="flex items-center gap-2 font-bold text-emerald-900">
            <Lock className="w-4 h-4 text-emerald-700" /> Strict Document Isolation & Confidentiality
          </div>
          <p className="leading-relaxed">
            Border Export Hub operates under zero-leakage security. Your national identity cards (CNIC/Passport), company tax registries, and vehicle chassis documentation are stored in encrypted private vaults. They are never indexed publicly or accessible to arbitrary traders. Only authorized compliance review officers with an active audit case may inspect verification files.
          </p>
        </div>

        {
    /* Standards Grid */
  }
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" /> Commercial Trader Requirements
            </h3>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Valid National Tax Number (NTN) or commercial registration.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Verified identity documents of principal business officer.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Corridor trade history and legitimate goods origin certification.</span>
              </li>
            </ul>
            <div className="pt-2">
              <Link
    to="/verification"
    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700"
  >
                Go to Verification Center <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-teal-600" /> Carrier & Transporter Standards
            </h3>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                <span>Commercial HTV or international road driving permits.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                <span>Registered vehicle books matching engine and chassis plate.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                <span>Bilateral road transit documentation at Taftan, Chaman, or Rimdan.</span>
              </li>
            </ul>
            <div className="pt-2">
              <Link
    to="/vehicles"
    className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:text-teal-700"
  >
                Manage Vehicles <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {
    /* Direct Compliance Help */
  }
        <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="font-bold text-sm">Have Questions Regarding Corridor Verification?</div>
            <div className="text-xs text-slate-400 mt-0.5">Contact our compliance review desk directly for guidance.</div>
          </div>
          <div className="flex items-center gap-3">
            <a
    href="https://wa.me/923324042186"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl transition"
  >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp 03324042186
            </a>
            <a
    href="mailto:Yasinsasoli186@gmail.com"
    className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs px-3.5 py-2 rounded-xl border border-slate-700 transition"
  >
              <Mail className="w-3.5 h-3.5 text-emerald-400" /> Email Support
            </a>
          </div>
        </div>
      </div>
    </AppShell>;
}
