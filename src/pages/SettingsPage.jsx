import { Link, useNavigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { AppShell } from "../components/layout/AppShell.jsx";
import {
  Settings,
  User,
  Mail,
  CheckCircle2,
  Headphones,
  Save,
  MessageCircle
} from "lucide-react";
export default function SettingsPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) {
          setCurrentUser(data.user);
          setFullName(data.user.fullName || "");
          setBusinessName(data.user.businessName || "");
          setPhone(data.user.phone || "");
          setCity(data.user.city || "");
          setCountry(data.user.country || "Pakistan");
        }
      } catch (err) {
        console.error("Failed to load settings user:", err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          phone
        })
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3e3);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };
  return <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        {
    /* Header */
  }
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">Account & Platform Settings</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your profile, security preferences, and reach direct corridor support.
              </p>
            </div>
          </div>
        </div>

        {
    /* Support & Assistance Card (Highlighted as requested) */
  }
        <div className="bg-gradient-to-br from-[#0c2e35] via-[#09222c] to-[#061822] text-white rounded-2xl p-6 border border-teal-800/60 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 border border-emerald-500/30">
                <Headphones className="w-3.5 h-3.5" /> Direct Support Desk
              </div>
              <h3 className="text-lg font-bold text-white">Need Help or Have Any Questions?</h3>
              <p className="text-xs text-slate-300 mt-1">
                Reach our dedicated trade corridor support team directly via WhatsApp or Email:
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
    href="https://wa.me/923324042186"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition"
  >
                <MessageCircle className="w-4 h-4" />
                WhatsApp: 03324042186
              </a>

              <a
    href="mailto:Yasinsasoli186@gmail.com"
    className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition"
  >
                <Mail className="w-4 h-4 text-emerald-400" />
                Yasinsasoli186@gmail.com
              </a>
            </div>
          </div>
        </div>

        {
    /* Profile Settings Form */
  }
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-6">
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" /> Personal & Business Profile
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 capitalize">
              Role: {currentUser?.role || "Member"}
            </span>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
    type="text"
    disabled
    value={fullName}
    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 cursor-not-allowed"
  />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
    type="email"
    disabled
    value={currentUser?.email || ""}
    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 cursor-not-allowed"
  />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Business / Trade Entity Name</label>
                <input
    type="text"
    value={businessName}
    onChange={(e) => setBusinessName(e.target.value)}
    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-800"
  />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone / WhatsApp</label>
                <input
    type="text"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-800"
  />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Corridor City</label>
                <input
    type="text"
    disabled
    value={city}
    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 cursor-not-allowed"
  />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Country</label>
                <input
    type="text"
    disabled
    value={country}
    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 cursor-not-allowed"
  />
              </div>
            </div>

            {saveSuccess && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Settings saved successfully!
              </div>}

            <div className="pt-3 flex justify-end">
              <button
    type="submit"
    disabled={saving}
    className="inline-flex items-center gap-2 bg-[#059669] hover:bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition"
  >
                <Save className="w-4 h-4" />
                {saving ? "Saving Changes..." : "Save Settings"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>;
}
