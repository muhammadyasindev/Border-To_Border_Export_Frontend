import { Link, useNavigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { AppShell } from "../components/layout/AppShell.jsx";
import { StatusBadge } from "../components/ui/StatusBadge.jsx";
import {
  ShieldCheck,
  UploadCloud,
  FileCheck,
  CheckCircle2,
  Lock,
  FileText,
  User,
  Building,
  MapPin,
  CreditCard,
  Image as ImageIcon,
  Save
} from "lucide-react";
import { EditableSelect } from "../components/ui/EditableSelect.jsx";
import { VERIFICATION_DOC_TYPES } from "../lib/constants.js";
import { safeFetch } from "../lib/api.js";
export default function VerificationPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [savingIdentity, setSavingIdentity] = useState(false);
  const [identityMessage, setIdentityMessage] = useState("");
  const [cnicNumber, setCnicNumber] = useState("");
  const [personAddress, setPersonAddress] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [docType, setDocType] = useState("");
  const [docNumber, setDocNumber] = useState("");
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileSize, setFileSize] = useState("");
  const [fileDataUrl, setFileDataUrl] = useState("");
  const handleDeviceFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      setFileSize((file.size / (1024 * 1024)).toFixed(2) + " MB");
      const reader = new FileReader();
      reader.onload = () => {
        setFileDataUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleDevicePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const loadVerification = async () => {
    try {
      const res = await safeFetch("/api/verification");
      const resData = res.data;
      if (res.ok && resData) {
        setData(resData);
        if (resData.user) {
          setCnicNumber(resData.user.cnicNumber || "");
          setPersonAddress(resData.user.personAddress || "");
          setBusinessName(resData.user.businessName || "");
          setBusinessAddress(resData.user.businessAddress || "");
          setAvatarUrl(resData.user.avatarUrl || "");
        }
      } else {
        // Fallback: check /api/auth/me if verification returned non-ok
        const meRes = await safeFetch("/api/auth/me");
        if (meRes.ok && meRes.data?.user) {
          setData({ user: meRes.data.user, documents: [] });
          setCnicNumber(meRes.data.user.cnicNumber || "");
          setPersonAddress(meRes.data.user.personAddress || "");
          setBusinessName(meRes.data.user.businessName || "");
          setBusinessAddress(meRes.data.user.businessAddress || "");
          setAvatarUrl(meRes.data.user.avatarUrl || "");
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadVerification();
  }, []);
  const handleSaveIdentity = async (e) => {
    e.preventDefault();
    setSavingIdentity(true);
    setIdentityMessage("");
    try {
      const res = await safeFetch("/api/verification", {
        method: "POST",
        body: JSON.stringify({
          cnicNumber,
          personAddress,
          businessName,
          businessAddress,
          avatarUrl
        })
      });
      if (res.ok) {
        setIdentityMessage("Identity & business location details saved successfully!");
        loadVerification();
      }
    } catch (e2) {
      console.error(e2);
    } finally {
      setSavingIdentity(false);
    }
  };
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!fileName && !selectedFile) {
      alert("Please select a document file from your device");
      return;
    }
    setSubmitting(true);
    try {
      const res = await safeFetch("/api/verification", {
        method: "POST",
        body: JSON.stringify({
          documentType: docType || "commercial_license",
          documentNumber: docNumber || cnicNumber || "DOC-SUB-8492",
          fileName: fileName || selectedFile?.name || "document.pdf",
          fileSize: fileSize || "1.4 MB",
          fileUrl: fileDataUrl || null,
          cnicNumber,
          personAddress,
          businessAddress,
          avatarUrl
        })
      });
      if (res.ok) {
        setFormSuccess(true);
        setTimeout(() => {
          setShowModal(false);
          setFormSuccess(false);
          setFileName("");
          setDocNumber("");
          setSelectedFile(null);
          setFileDataUrl("");
          loadVerification();
        }, 800);
      }
    } catch (e2) {
      console.error(e2);
    } finally {
      setSubmitting(false);
    }
  };
  const token = typeof localStorage !== "undefined" ? localStorage.getItem("bg_auth_token") : null;
  const isExplorer = !data?.user && !token;
  if (!loading && isExplorer) {
    return <AppShell>
        <div className="space-y-6">
          {
      /* Top Header Card */
    }
          <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-semibold mb-2 border border-blue-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Corridor Trust & Compliance Guide
              </div>
              <h1 className="text-xl font-bold text-[#142B4A]">
                Commercial Verification: Process & Requirements
              </h1>
              <p className="text-xs text-[#64748B] mt-1">
                BorderGlow enforces rigorous identity verification for cross-border traders while guaranteeing zero public exposure of sensitive identity scans.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
      to="/login"
      className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition"
    >
                Sign In
              </Link>
              <Link
      to="/register"
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition shadow-xs"
    >
                Register to Verify
              </Link>
            </div>
          </div>

          {
      /* Privacy Guarantee Banner */
    }
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex items-start gap-3.5">
            <Lock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900 space-y-1">
              <h3 className="font-bold text-sm text-blue-950">Bank-Grade Privacy & Authorized Review Protocol</h3>
              <p className="leading-relaxed">
                Your CNIC, passport scans, tax certificates, and vehicle registration papers are stored in private, quarantined encrypted storage.
                Original identity documents are <strong>NEVER</strong> published to public visitors, unauthenticated explorers, or marketplace search results. Only licensed compliance officers review them during onboarding.
              </p>
            </div>
          </div>

          {
      /* What Is Needed for Verification */
    }
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-6 space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              What Documents Are Needed for Verification?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {
      /* Exporters and Importers */
    }
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm text-[#142B4A]">
                  <Building className="w-4 h-4 text-blue-600" />
                  <span>Exporters & Wholesale Buyers</span>
                </div>
                <ul className="text-xs space-y-2 text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>National Identity Document:</strong> Valid CNIC (Pakistan), Tazkira (Afghanistan), or Melli Identity Card (Iran).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Business NTN / Tax ID:</strong> Official tax registration certificate (FBR in Pakistan, Ministry of Finance in Afghanistan/Iran).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Chamber of Commerce Membership:</strong> Active trade association or chamber registration certificate.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Warehouse / Business Address:</strong> Verified physical operating address for corridor dispatch.</span>
                  </li>
                </ul>
              </div>

              {
      /* Drivers & Hauliers */
    }
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm text-[#142B4A]">
                  <CreditCard className="w-4 h-4 text-amber-600" />
                  <span>Commercial Hauliers & Transport Drivers</span>
                </div>
                <ul className="text-xs space-y-2 text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Commercial Heavy Driving License:</strong> Valid HTV / LTV Commercial driving license with unexpired validity.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Vehicle Registration Book:</strong> Official government vehicle registration documents and plate number.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Border Transit Road Permit:</strong> Cross-border transit permit (Taftan / Chaman / Rimdan border crossings).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Personal Address Verification:</strong> Verified residential and logistics hub dispatch address.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {
      /* Step-by-Step Process */
    }
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              The 3-Step Verification Pipeline
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-blue-600 font-bold text-base mb-1.5">01. Submit Identity</div>
                <p className="text-slate-600 leading-relaxed">
                  Sign in to your BorderGlow account and upload clear scans of your national identity and business credentials.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-blue-600 font-bold text-base mb-1.5">02. Compliance Review</div>
                <p className="text-slate-600 leading-relaxed">
                  Authorized compliance officers cross-reference credentials against customs and chamber registers in an isolated environment.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-emerald-600 font-bold text-base mb-1.5">03. Verified Shield Badge</div>
                <p className="text-slate-600 leading-relaxed">
                  Your profile is awarded the green Verified Trader Shield, unlocking private deal rooms, escrow arrangements, and haulage contracts.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Have credentials ready? Register your account to begin the verification process.
              </span>
              <Link
      to="/register"
      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
    >
                Register as Trader →
              </Link>
            </div>
          </div>
        </div>
      </AppShell>;
  }
  const status = data?.verificationStatus || "not_submitted";
  const isVerified = status === "verified";
  return <AppShell>
      <div className="space-y-6">
        {
    /* Top Header */
  }
        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-[#142B4A]">
                Verification Center & Identity Compliance
              </h1>
              <StatusBadge status={status} />
            </div>
            <p className="text-xs text-[#64748B]">
              Rigorous personal CNIC vetting, business location verification, and enterprise documentation ensure trustworthy commercial execution.
            </p>
          </div>

          <button
    onClick={() => setShowModal(true)}
    className="inline-flex items-center gap-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-medium text-xs px-3.5 py-2 rounded-lg shadow-xs transition shrink-0"
  >
            <UploadCloud className="w-4 h-4" />
            Upload Verification Document
          </button>
        </div>

        {
    /* Security & Document Privacy Shield */
  }
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
          <Lock className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600 space-y-1">
            <h4 className="font-semibold text-slate-800">Bank-Grade Privacy & Authorized Review Protocol</h4>
            <p>
              Sensitive identity certificates (CNIC, National ID, Personal Address, Tax IDs) are stored with restricted encryption.
              Original identity numbers and personal addresses are never published to public visitors or unauthenticated marketplace queries.
            </p>
          </div>
        </div>

        {
    /* Person & Business Location Identity Card (User Requested) */
  }
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-6">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-[#142B4A] flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                Personal Identity & Business Location Verification
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Declare your person CNIC, residential address, enterprise location, and photo ID.
              </p>
            </div>
            {identityMessage && <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                ✓ {identityMessage}
              </span>}
          </div>

          <form onSubmit={handleSaveIdentity} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                  Person CNIC / National Identity Card Number *
                </label>
                <input
    type="text"
    required
    placeholder="e.g. 54401-1234567-1"
    value={cnicNumber}
    onChange={(e) => setCnicNumber(e.target.value)}
    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
  />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                  Person Photo (Upload from Device)
                </label>
                <div className="flex items-center gap-2">
                  {avatarUrl && <img src={avatarUrl} alt="Preview" className="w-8 h-8 rounded-full object-cover border border-slate-300 shrink-0" />}
                  <label className="flex-1 flex items-center justify-center gap-1.5 p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer text-xs text-slate-700 transition">
                    <UploadCloud className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">{avatarUrl ? "Change Photo from Device" : "Choose Photo from Device"}</span>
                    <input
    type="file"
    accept="image/*"
    className="hidden"
    onChange={handleDevicePhotoSelect}
  />
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  Residential Address of Person *
                </label>
                <input
    type="text"
    placeholder="e.g. House 14, Street 3, Jinnah Town, Quetta"
    value={personAddress}
    onChange={(e) => setPersonAddress(e.target.value)}
    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
  />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-500" />
                  Business Enterprise / Trade Entity Name
                </label>
                <input
    type="text"
    placeholder="e.g. Bolan Agri Exports Ltd"
    value={businessName}
    onChange={(e) => setBusinessName(e.target.value)}
    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
  />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                Physical Business Address & Warehouse Location *
              </label>
              <input
    type="text"
    placeholder="e.g. Plot 12B, Industrial Trading Estate, Western Bypass, Quetta"
    value={businessAddress}
    onChange={(e) => setBusinessAddress(e.target.value)}
    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
  />
            </div>

            <div className="flex justify-end pt-2">
              <button
    type="submit"
    disabled={savingIdentity}
    className="inline-flex items-center gap-1.5 bg-[#142B4A] hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2 rounded-lg transition"
  >
                <Save className="w-3.5 h-3.5" />
                {savingIdentity ? "Saving Details..." : "Save Identity & Location Details"}
              </button>
            </div>
          </form>
        </div>

        {
    /* Status Breakdown Card */
  }
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5">
          <h3 className="font-bold text-sm text-[#142B4A] mb-3">Overall Verification Status</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <div className="text-xs text-slate-500 font-medium">Compliance Decision</div>
              <div className="mt-2">
                <StatusBadge status={status} />
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                {isVerified ? "Your trade business is fully approved for commercial bilateral deal contracts and customs manifests." : "Documents under review by BorderGlow trade compliance bureau."}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <div className="text-xs text-slate-500 font-medium">Compliance Auditor Notes</div>
              <p className="text-xs text-[#172B4D] font-medium mt-2">
                {data?.verificationNotes || "Awaiting review by BorderGlow compliance department."}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <div className="text-xs text-slate-500 font-medium">Corridor Permissions</div>
              <ul className="text-[11px] text-slate-600 space-y-1 mt-2">
                <li className="flex items-center gap-1 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Direct Buyer Inquiries Enabled
                </li>
                <li className="flex items-center gap-1 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Private Deal Room Creation
                </li>
                <li className="flex items-center gap-1 text-blue-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Live GPS Dispatch Coordination
                </li>
              </ul>
            </div>
          </div>
        </div>

        {
    /* Uploaded Documents Table */
  }
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-[#142B4A]">
              Submitted Verification Documents ({data?.documents?.length || 0})
            </h3>
            <span className="text-[11px] text-slate-400">Encrypted Storage</span>
          </div>

          {loading ? <div className="py-8 text-center text-xs text-slate-400">Loading documents...</div> : data?.documents && data.documents.length > 0 ? <div className="divide-y divide-slate-100 mt-2">
              {data.documents.map((doc) => <div key={doc.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-xs text-[#172B4D]">{doc.fileName}</span>
                      <StatusBadge status={doc.status} size="sm" />
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                      <span className="uppercase font-medium text-slate-600">{doc.documentType.replace(/_/g, " ")}</span>
                      <span>•</span>
                      <span>Ref: {doc.documentNumber}</span>
                      <span>•</span>
                      <span>Submitted: {new Date(doc.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 italic">
                      {doc.reviewerNotes || "Pending auditor signoff"}
                    </span>
                  </div>
                </div>)}
            </div> : <div className="py-8 text-center text-xs text-slate-400">
              <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              No documents submitted yet.
              <br />
              <button
    onClick={() => setShowModal(true)}
    className="mt-3 text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium px-3.5 py-1.5 rounded-lg transition"
  >
                Upload First Document
              </button>
            </div>}
        </div>

        {
    /* Modal: Upload Verification Document */
  }
        {showModal && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-base text-[#142B4A]">Submit Compliance Document</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
              </div>

              {formSuccess ? <div className="py-10 text-center text-emerald-600">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-emerald-500" />
                  <p className="font-bold text-sm">Document Submitted for Review!</p>
                </div> : <form onSubmit={handleUpload} className="space-y-4 mt-4">
                  <div>
                    <EditableSelect
    label="Document Type *"
    value={docType}
    onChange={setDocType}
    options={VERIFICATION_DOC_TYPES}
  />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Official Document / Certificate Number
                    </label>
                    <input
    type="text"
    placeholder="e.g. CNIC # 54401-1234567-1 or SECP-89210"
    value={docNumber}
    onChange={(e) => setDocNumber(e.target.value)}
    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
  />
                  </div>

                  {
    /* Device Document Upload */
  }
                  <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <UploadCloud className="w-4 h-4 text-blue-600" />
                        Select Verification Document from Device *
                      </span>
                      {selectedFile && <span className="text-[10px] text-emerald-600 font-bold">Selected</span>}
                    </label>

                    {selectedFile ? <div className="mt-2 p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2 truncate">
                          <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div className="truncate">
                            <div className="text-xs font-semibold text-slate-800 truncate">{selectedFile.name}</div>
                            <div className="text-[10px] text-slate-400">{fileSize}</div>
                          </div>
                        </div>
                        <button
    type="button"
    onClick={() => {
      setSelectedFile(null);
      setFileName("");
      setFileSize("");
      setFileDataUrl("");
    }}
    className="text-slate-400 hover:text-rose-500 p-1 text-xs"
  >
                          ✕ Remove
                        </button>
                      </div> : <label className="mt-1 flex flex-col items-center justify-center p-4 border border-dashed border-slate-300 rounded-lg bg-white cursor-pointer hover:bg-blue-50/50 hover:border-blue-400 transition">
                        <UploadCloud className="w-6 h-6 text-blue-600 mb-1" />
                        <span className="text-xs font-semibold text-blue-600">Choose file from your device</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">PDF, PNG, JPG (CNIC scan, Business License, Chamber Certificate)</span>
                        <input
    type="file"
    accept=".pdf,.png,.jpg,.jpeg,.webp"
    className="hidden"
    onChange={handleDeviceFileSelect}
  />
                      </label>}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
    type="button"
    onClick={() => setShowModal(false)}
    className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
  >
                      Cancel
                    </button>
                    <button
    type="submit"
    disabled={submitting}
    className="px-4 py-2 text-xs font-medium bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg shadow-xs transition"
  >
                      {submitting ? "Uploading..." : "Submit for Verification"}
                    </button>
                  </div>
                </form>}
            </div>
          </div>}
      </div>
    </AppShell>;
}
