import { Link, useNavigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { AppShell } from "../components/layout/AppShell.jsx";
import {
  FileText,
  ShieldCheck,
  Lock,
  Download,
  Eye,
  CheckCircle2,
  FileCheck,
  Search
} from "lucide-react";

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const sampleDocs = [
    {
      id: "DOC-2026-081",
      name: "Taftan Border Transit Clearance (Customs Form E)",
      type: "Customs Declaration",
      corridor: "Pakistan \u21C4 Iran",
      fileSize: "2.4 MB (PDF)",
      uploadDate: "Oct 10, 2026",
      status: "verified"
    },
    {
      id: "DOC-2026-074",
      name: "Phytosanitary Health Certificate - Fresh Mandarins",
      type: "Agricultural Inspection",
      corridor: "Pakistan \u21C4 Iran",
      fileSize: "1.8 MB (PDF)",
      uploadDate: "Oct 08, 2026",
      status: "verified"
    },
    {
      id: "DOC-2026-069",
      name: "Chaman Road Haulage Consignment Note (CMR)",
      type: "Bill of Lading / Consignment",
      corridor: "Pakistan \u21C4 Afghanistan",
      fileSize: "890 KB (PDF)",
      uploadDate: "Oct 05, 2026",
      status: "verified"
    },
    {
      id: "DOC-2026-052",
      name: "Commercial Invoice & Itemized Packing List #PK-IR-992",
      type: "Commercial Invoice",
      corridor: "Pakistan \u21C4 Iran",
      fileSize: "1.2 MB (PDF)",
      uploadDate: "Oct 02, 2026",
      status: "confidential"
    }
  ];
  const filteredDocs = sampleDocs.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || doc.type.toLowerCase().includes(searchTerm.toLowerCase()) || doc.corridor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });
  return <AppShell>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {
    /* Header */
  }
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
              Trade Documents Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Documents & Customs Clearance
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Secure digital repository for Bills of Lading, Phytosanitary inspection forms, and corridor customs filings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
    to="/verification"
    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs"
  >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              KYC Verification
            </Link>
          </div>
        </div>

        {
    /* Security & Confidentiality Banner */
  }
        <div className="bg-[#0A1628] rounded-2xl p-5 text-white border border-[#132338] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <Lock className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                End-to-End Document Confidentiality
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-semibold">
                  Active
                </span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                Trade documents and invoice manifests are encrypted at rest. Files are restricted strictly between authorized counter-parties involved in the deal room and licensed border clearance inspectors.
              </p>
            </div>
          </div>
        </div>

        {
    /* Search & Filter Bar */
  }
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
    type="text"
    placeholder="Search trade documents, B/L, invoices..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
  />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-500">Filter:</span>
            <button
    onClick={() => setActiveTab("all")}
    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === "all" ? "bg-[#0A1628] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
  >
              All Files ({sampleDocs.length})
            </button>
          </div>
        </div>

        {
    /* Documents Table */
  }
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-6 py-4">Document Title</th>
                  <th className="px-4 py-4">Category</th>
                  <th className="px-4 py-4">Corridor</th>
                  <th className="px-4 py-4">File Size</th>
                  <th className="px-4 py-4">Date</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredDocs.map((doc) => <tr key={doc.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{doc.name}</div>
                        <div className="text-[11px] font-mono text-slate-400">{doc.id}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-600">{doc.type}</td>
                    <td className="px-4 py-4 font-semibold text-slate-800">{doc.corridor}</td>
                    <td className="px-4 py-4 text-slate-500 font-mono">{doc.fileSize}</td>
                    <td className="px-4 py-4 text-slate-500">{doc.uploadDate}</td>
                    <td className="px-4 py-4">
                      {doc.status === "verified" ? <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                        </span> : <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                          <Lock className="w-3 h-3 text-slate-500" /> Confidential
                        </span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
    onClick={() => alert(`Opening secure preview for ${doc.name}`)}
    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-300 transition"
    title="Preview Document"
  >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
    onClick={() => alert(`Downloading encrypted file for ${doc.name}`)}
    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-300 transition"
    title="Download Document"
  >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>

        {
    /* Support Footer Banner */
  }
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-bold text-sm text-[#0F172A]">Need assistance with customs clearance documents?</h4>
            <p className="text-xs text-slate-500">
              Our 24/7 Trade Desk directly coordinates with border agents in Taftan, Chaman, and Rimdan.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
    href="https://wa.me/923324042186"
    target="_blank"
    rel="noopener noreferrer"
    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
  >
              WhatsApp Support (03324042186)
            </a>
          </div>
        </div>
      </div>
    </AppShell>;
}
