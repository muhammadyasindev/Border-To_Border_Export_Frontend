import { Link, useNavigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { AppShell } from "../components/layout/AppShell.jsx";
import { StatusBadge } from "../components/ui/StatusBadge.jsx";
import {
  Lock
} from "lucide-react";
export default function AdminVerificationPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [decisionNotes, setDecisionNotes] = useState("");
  const loadQueue = async () => {
    try {
      const res = await fetch("/api/admin/verification");
      if (!res.ok) {
        if (res.status === 403) {
          setError("Access restricted to authorized compliance reviewers. Switch to Admin persona using the header selector.");
        } else {
          setError("Failed to load verification queue");
        }
        return;
      }
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadQueue();
  }, []);
  const handleDecision = async (action) => {
    if (!selectedDoc) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docId: selectedDoc.id,
          targetUserId: selectedDoc.userId,
          action,
          notes: decisionNotes || (action === "approve" ? "Verified and approved by trade compliance" : "Document revision requested")
        })
      });
      if (res.ok) {
        setSelectedDoc(null);
        setDecisionNotes("");
        await loadQueue();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };
  return <AppShell>
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-[#142B4A]">
                Compliance & Verification Queue
              </h1>
              <span className="bg-amber-100 text-amber-900 text-xs font-semibold px-2 py-0.5 rounded">
                Restricted Compliance Bureau
              </span>
            </div>
            <p className="text-xs text-[#64748B]">
              Review enterprise registration evidence, national IDs, and commercial transport permits.
            </p>
          </div>

          <div className="text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
            Pending Queue: <span className="font-bold text-[#142B4A]">{documents.filter((d) => d.status === "pending_review").length}</span> applications
          </div>
        </div>

        {error ? <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
            <Lock className="w-10 h-10 text-amber-700 mx-auto mb-2" />
            <h3 className="font-bold text-sm text-amber-900">{error}</h3>
            <p className="text-xs text-amber-800 mt-1">
              Use the top-right header role switcher and click "Admin" to access verification reviewer controls.
            </p>
          </div> : loading ? <div className="bg-white rounded-xl p-8 text-center text-xs text-slate-400">Loading queue...</div> : <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Trader / Business</th>
                    <th className="py-3 px-4">Role & Corridor</th>
                    <th className="py-3 px-4">Document Type</th>
                    <th className="py-3 px-4">Doc Number</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Submitted</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {documents.map((doc) => <tr key={doc.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 font-semibold text-[#142B4A]">
                        {doc.userFullName}
                        {doc.userBusinessName && <div className="text-[11px] font-normal text-slate-500">
                            {doc.userBusinessName}
                          </div>}
                      </td>
                      <td className="py-3 px-4">
                        <span className="capitalize font-medium text-slate-700">{doc.userRole}</span>
                        <div className="text-[11px] text-slate-400">{doc.userCountry}</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {doc.documentType.replace(/_/g, " ")}
                        <div className="text-[11px] text-slate-500">{doc.fileName}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {doc.documentNumber}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={doc.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {new Date(doc.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
    onClick={() => setSelectedDoc(doc)}
    className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium px-3 py-1 rounded border border-blue-200 transition"
  >
                          Review & Audit
                        </button>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>}

        {
    /* Modal: Compliance Audit & Decision */
  }
        {selectedDoc && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-base text-[#142B4A]">
                  Review Document: {selectedDoc.fileName}
                </h3>
                <button onClick={() => setSelectedDoc(null)} className="text-slate-400 text-sm">✕</button>
              </div>

              <div className="my-4 space-y-2 bg-slate-50 p-3.5 rounded-lg border border-slate-100 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Applicant:</span>
                  <span className="font-semibold text-slate-800">{selectedDoc.userFullName} ({selectedDoc.userRole})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Business Entity:</span>
                  <span className="font-semibold text-slate-800">{selectedDoc.userBusinessName || "Sole Proprietor"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Document Type:</span>
                  <span className="font-semibold text-slate-800">{selectedDoc.documentType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Document Identifier:</span>
                  <span className="font-mono font-bold text-blue-800">{selectedDoc.documentNumber}</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Compliance Auditor Feedback / Notes
                </label>
                <textarea
    rows={3}
    placeholder="Enter audit remarks or requested additional documentation..."
    value={decisionNotes}
    onChange={(e) => setDecisionNotes(e.target.value)}
    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
  />
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
                <button
    type="button"
    disabled={actionLoading}
    onClick={() => handleDecision("reject")}
    className="px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg"
  >
                  Reject Application
                </button>
                <button
    type="button"
    disabled={actionLoading}
    onClick={() => handleDecision("changes_required")}
    className="px-3 py-2 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg"
  >
                  Request Changes
                </button>
                <button
    type="button"
    disabled={actionLoading}
    onClick={() => handleDecision("approve")}
    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
  >
                  Approve & Verify Trader
                </button>
              </div>
            </div>
          </div>}
      </div>
    </AppShell>;
}
