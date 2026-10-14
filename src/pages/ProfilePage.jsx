import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { AppShell } from "../components/layout/AppShell.jsx";
import { StatusBadge } from "../components/ui/StatusBadge.jsx";
import {
  MapPin,
  Building,
  MessageSquare,
  Lock,
  ShieldCheck,
  UploadCloud,
  FileCheck,
  CheckCircle2,
  FileText,
  User,
  CreditCard,
  Image as ImageIcon,
  Save,
  X,
  Download,
  AlertCircle
} from "lucide-react";
import { EditableSelect } from "../components/ui/EditableSelect.jsx";
import { VERIFICATION_DOC_TYPES } from "../lib/constants.js";
import { safeFetch } from "../lib/api.js";

export default function ProfilePage() {
  const params = useParams();
  const userId = params?.id;
  const [profileData, setProfileData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verification & KYC state
  const [verificationData, setVerificationData] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [submittingDoc, setSubmittingDoc] = useState(false);
  const [savingIdentity, setSavingIdentity] = useState(false);
  const [identityMessage, setIdentityMessage] = useState("");
  const [docUploadSuccess, setDocUploadSuccess] = useState(false);

  // Identity Form fields
  const [cnicNumber, setCnicNumber] = useState("");
  const [personAddress, setPersonAddress] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // Document Upload fields
  const [docType, setDocType] = useState("national_id");
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

  const loadData = async () => {
    try {
      const meRes = await safeFetch("/api/auth/me");
      const myUser = meRes.data?.user || null;
      setCurrentUser(myUser);

      // Load target profile
      const targetId = userId || myUser?.id || myUser?._id;
      if (targetId) {
        const res = await safeFetch(`/api/profiles/${targetId}`);
        if (res.ok && res.data) {
          setProfileData(res.data);
        }
      }

      // Load verification status & documents
      const verRes = await safeFetch("/api/verification");
      if (verRes.ok && verRes.data) {
        setVerificationData(verRes.data);
        const u = verRes.data.user || myUser;
        if (u) {
          setCnicNumber(u.cnicNumber || "");
          setPersonAddress(u.personAddress || "");
          setBusinessName(u.businessName || "");
          setBusinessAddress(u.businessAddress || "");
          setAvatarUrl(u.avatarUrl || "");
        }
      } else if (myUser) {
        setVerificationData({ user: myUser, documents: [] });
        setCnicNumber(myUser.cnicNumber || "");
        setPersonAddress(myUser.personAddress || "");
        setBusinessName(myUser.businessName || "");
        setBusinessAddress(myUser.businessAddress || "");
        setAvatarUrl(myUser.avatarUrl || "");
      }
    } catch (e) {
      console.error("Error loading profile data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userId]);

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
          avatarUrl,
        }),
      });
      if (res.ok) {
        setIdentityMessage("Identity & business location details saved successfully!");
        loadData();
        setTimeout(() => setIdentityMessage(""), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingIdentity(false);
    }
  };

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    if (!fileName && !selectedFile) {
      alert("Please choose a verification document file from your device.");
      return;
    }
    setSubmittingDoc(true);
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
          avatarUrl,
        }),
      });

      if (res.ok) {
        setDocUploadSuccess(true);
        setShowUploadModal(false);
        setSelectedFile(null);
        setFileName("");
        setDocNumber("");
        loadData();
        setTimeout(() => setDocUploadSuccess(false), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingDoc(false);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="h-64 bg-white rounded-xl border border-slate-200 animate-pulse" />
      </AppShell>
    );
  }

  const user = profileData?.user || currentUser;
  if (!user) {
    return (
      <AppShell>
        <div className="bg-white rounded-xl p-8 text-center text-sm text-slate-500">
          User profile not found.
        </div>
      </AppShell>
    );
  }

  const isOwnProfile =
    !userId ||
    String(currentUser?.id) === String(user.id) ||
    String(currentUser?._id) === String(user._id) ||
    String(currentUser?.id) === String(userId) ||
    String(currentUser?._id) === String(userId);

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#142B4A] to-blue-800 text-white flex items-center justify-center font-extrabold text-2xl shadow-sm overflow-hidden ring-2 ring-blue-500/20">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                ) : (
                  user.fullName.charAt(0)
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-[#142B4A]">{user.fullName}</h1>
                  <StatusBadge status={user.verificationStatus || "not_submitted"} size="sm" />
                </div>

                <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2 mt-1">
                  <span className="font-semibold text-slate-700 capitalize">{user.role}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {user.city || "Quetta"}, {user.country || "Pakistan"}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    {user.businessName || "Registered Trade Merchant"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {isOwnProfile ? (
                <button
                  type="button"
                  onClick={() => setShowUploadModal(true)}
                  className="inline-flex items-center gap-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  Upload Verification Document
                </button>
              ) : (
                <Link
                  to={`/conversations?newDeal=general&targetUserId=${user.id || user._id}&title=${encodeURIComponent(`Direct Inquiry: ${user.fullName}`)}`}
                  className="inline-flex items-center gap-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-xs transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  Initiate Deal Discussion
                </Link>
              )}
            </div>
          </div>

          {user.bio && (
            <p className="text-xs text-slate-600 mt-4 pt-4 border-t border-slate-100 leading-relaxed max-w-3xl">
              {user.bio}
            </p>
          )}
        </div>

        {/* Success Alert */}
        {docUploadSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            Verification document uploaded successfully and queued for compliance review!
          </div>
        )}

        {/* Identity & Verification Center (Kept right on profile page as requested) */}
        {isOwnProfile && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-base font-extrabold text-[#142B4A]">
                    Verification Center & Identity Compliance
                  </h2>
                  <StatusBadge status={user.verificationStatus || "not_submitted"} size="sm" />
                </div>
                <p className="text-xs text-slate-500">
                  Rigorous personal CNIC vetting, business location verification, and enterprise documentation ensure trustworthy commercial execution.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer self-start sm:self-auto shrink-0"
              >
                <UploadCloud className="w-4 h-4" />
                Upload Verification Document
              </button>
            </div>

            {/* Privacy notice banner */}
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2.5 text-[11px] text-slate-500">
              <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                <strong>Bank-Grade Privacy:</strong> Sensitive identity certificates (CNIC, National ID, Tax IDs) are stored encrypted. Personal identity numbers are never published to public marketplace queries.
              </span>
            </div>

            {/* Personal Identity & Location Form */}
            <form onSubmit={handleSaveIdentity} className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4 text-blue-600" />
                  Personal Identity & Business Location Details
                </h3>
                {identityMessage && (
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {identityMessage}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Person CNIC / National Identity Card Number *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 54401-1234567-1"
                    value={cnicNumber}
                    onChange={(e) => setCnicNumber(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Person Photo (Upload from Device)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleDevicePhotoSelect}
                      className="text-xs text-slate-500 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                    />
                    {avatarUrl && (
                      <img
                        src={avatarUrl}
                        alt="Preview"
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Residential Address of Person *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. House 14, Street 3, Jinnah Town, Quetta"
                    value={personAddress}
                    onChange={(e) => setPersonAddress(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Business Enterprise / Trade Entity Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bolan Commercial Logistics Ltd"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Physical Business Address / Warehouse Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Warehouse 4B, Taftan Border Logistics Center, Chagai"
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={savingIdentity}
                  className="inline-flex items-center gap-1.5 bg-[#142B4A] hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  {savingIdentity ? "Saving..." : "Save Identity & Location Details"}
                </button>
              </div>
            </form>

            {/* Uploaded Documents List */}
            {verificationData?.documents && verificationData.documents.length > 0 && (
              <div className="p-6 pt-0 border-t border-slate-100 mt-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 pt-4 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  Uploaded Verification Documents ({verificationData.documents.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {verificationData.documents.map((doc) => (
                    <div
                      key={doc.id || doc._id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileCheck className="w-5 h-5 text-blue-600 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">
                            {doc.fileName || doc.documentType}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {doc.documentNumber} • {doc.fileSize || "1.2 MB"}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={doc.verificationStatus || "pending"} size="xs" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Offerings by User */}
        <div>
          <h3 className="font-bold text-sm text-[#142B4A] mb-3">
            Active Catalog & Corridor Offerings ({user.role})
          </h3>

          {user.role === "exporter" &&
            (profileData?.products && profileData.products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profileData.products.map((p) => (
                  <div key={p.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                    <div className="text-[10px] font-bold text-blue-600 uppercase mb-1">{p.category}</div>
                    <div className="font-bold text-xs text-[#142B4A]">{p.title}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      Avail: {p.quantityAvailable} {p.unit}
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="font-extrabold text-[#142B4A]">${p.pricePerUnit}</span>
                      <Link
                        to={`/conversations?newDeal=product&id=${p.id}&targetUserId=${user.id || user._id}&title=${encodeURIComponent(p.title)}`}
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
            ))}

          {user.role === "importer" &&
            (profileData?.demands && profileData.demands.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profileData.demands.map((d) => (
                  <div key={d.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                    <div className="text-[10px] font-bold text-blue-600 uppercase mb-1">RFQ: {d.category}</div>
                    <div className="font-bold text-xs text-[#142B4A]">{d.title}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      Target: {d.quantityRequired} {d.unit}
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="font-extrabold text-emerald-700">${d.targetPrice || "Negotiable"}</span>
                      <Link
                        to={`/conversations?newDeal=demand&id=${d.id}&targetUserId=${user.id || user._id}&title=${encodeURIComponent(d.title)}`}
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
            ))}

          {user.role === "driver" &&
            (profileData?.offers && profileData.offers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profileData.offers.map((o) => (
                  <div key={o.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                    <div className="font-bold text-xs text-[#142B4A]">{o.title}</div>
                    <div className="text-xs text-blue-900 font-medium mt-1">
                      {o.originCorridor} → {o.destinationCorridor}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Payload: {o.availableCapacityTons} MT</div>
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="font-extrabold text-[#142B4A]">
                        ${o.ratePerKmOrTrip} ({o.pricingUnit})
                      </span>
                      <Link
                        to={`/conversations?newDeal=transport&id=${o.id}&targetUserId=${user.id || user._id}&title=${encodeURIComponent(o.title)}`}
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
            ))}
        </div>

        {/* Upload Verification Document Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
                  <UploadCloud className="w-5 h-5 text-blue-600" />
                  Upload Verification Document
                </div>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUploadDocument} className="space-y-4 mt-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Document Classification Type *
                  </label>
                  <EditableSelect
                    options={VERIFICATION_DOC_TYPES}
                    value={docType}
                    onChange={setDocType}
                    placeholder="Select document category"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Document Registration / Reference Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CNIC number, FBR NTN, or Chamber Reg ID"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Device File Chooser */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Select File from Device (PDF, JPG, PNG) *
                  </label>
                  <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-5 text-center bg-slate-50/60 transition cursor-pointer relative">
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleDeviceFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <UploadCloud className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    {fileName ? (
                      <div>
                        <p className="font-bold text-slate-800 text-xs">{fileName}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{fileSize}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-semibold text-slate-700">Click or Drag & Drop file here</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Supports PDF scans or high-res photos</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl font-semibold text-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingDoc}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileCheck className="w-4 h-4" />
                    {submittingDoc ? "Uploading..." : "Submit for Compliance Review"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
