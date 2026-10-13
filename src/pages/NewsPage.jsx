import { Link, useNavigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { AppShell } from "../components/layout/AppShell.jsx";
import {
  Newspaper,
  PlusCircle,
  Clock,
  ShieldCheck,
  TrendingUp,
  CheckCircle2
} from "lucide-react";
export default function NewsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");
  const [corridorFilter, setCorridorFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("border_crossing");
  const [targetAudience, setTargetAudience] = useState("all");
  const [locationCorridor, setLocationCorridor] = useState("Taftan / Mirjaveh");
  const [summary, setSummary] = useState("");
  const [details, setDetails] = useState("");
  const [priceDetails, setPriceDetails] = useState("");
  const [waitingTimeHours, setWaitingTimeHours] = useState("");
  const [sourceName, setSourceName] = useState("");
  const loadNews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/news?category=${encodeURIComponent(activeCategory)}&corridor=${encodeURIComponent(corridorFilter)}`);
      const data = await res.json();
      setReports(data.news || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadNews();
  }, [activeCategory, corridorFilter]);
  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          targetAudience,
          locationCorridor,
          summary,
          details: details || summary,
          priceDetails: priceDetails || void 0,
          waitingTimeHours: waitingTimeHours ? Number(waitingTimeHours) : void 0,
          sourceName: sourceName || "Independent Trade Report"
        })
      });
      if (res.ok) {
        setFormSuccess(true);
        setTimeout(() => {
          setShowModal(false);
          setFormSuccess(false);
          loadNews();
        }, 800);
      }
    } catch (e2) {
      console.error(e2);
    } finally {
      setSubmitting(false);
    }
  };
  return <AppShell>
      <div className="space-y-6">
        {
    /* Top Header */
  }
        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-[#142B4A]">
                BorderPulse & Corridor Market Intelligence
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                Live Field Dispatch
              </span>
            </div>
            <p className="text-xs text-[#64748B]">
              Real-time customs waiting periods, road advisories, and mandi price indices across Taftan, Chaman, and Rimdan.
            </p>
          </div>

          <button
    onClick={() => setShowModal(true)}
    className="inline-flex items-center gap-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-medium text-xs px-3.5 py-2 rounded-lg shadow-xs transition"
  >
            <PlusCircle className="w-4 h-4" />
            Submit Corridor Report
          </button>
        </div>

        {
    /* Filter Navigation */
  }
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-xs text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
    onClick={() => setActiveCategory("")}
    className={`px-3 py-1.5 rounded-lg font-medium transition ${activeCategory === "" ? "bg-[#142B4A] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
  >
              All Reports
            </button>
            <button
    onClick={() => setActiveCategory("border_crossing")}
    className={`px-3 py-1.5 rounded-lg font-medium transition ${activeCategory === "border_crossing" ? "bg-[#142B4A] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
  >
              Border Crossings & Customs
            </button>
            <button
    onClick={() => setActiveCategory("market_prices")}
    className={`px-3 py-1.5 rounded-lg font-medium transition ${activeCategory === "market_prices" ? "bg-[#142B4A] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
  >
              Mandi Prices & Indices
            </button>
            <button
    onClick={() => setActiveCategory("road_condition")}
    className={`px-3 py-1.5 rounded-lg font-medium transition ${activeCategory === "road_condition" ? "bg-[#142B4A] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
  >
              Highway & Road Conditions
            </button>
            <button
    onClick={() => setActiveCategory("regulation_update")}
    className={`px-3 py-1.5 rounded-lg font-medium transition ${activeCategory === "regulation_update" ? "bg-[#142B4A] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
  >
              Customs & Regulatory Updates
            </button>
          </div>

          <div className="flex items-center gap-2">
            <select
    value={corridorFilter}
    onChange={(e) => setCorridorFilter(e.target.value)}
    className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
  >
              <option value="">All Corridors</option>
              <option value="Taftan">Taftan / Mirjaveh</option>
              <option value="Chaman">Chaman / Spin Boldak</option>
              <option value="Rimdan">Rimdan / Gabd</option>
            </select>
          </div>
        </div>

        {
    /* News Feed */
  }
        {loading ? <div className="space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-white rounded-xl border border-slate-200 animate-pulse" />)}
          </div> : reports.length > 0 ? <div className="space-y-4">
            {reports.map((item) => {
    const isOfficial = item.sourceType === "official_source";
    const isConfirmed = item.sourceType === "community_confirmed";
    return <div
      key={item.id}
      className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 hover:border-slate-300 transition"
    >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {item.locationCorridor}
                      </span>

                      {isOfficial && <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          Official Government / Chamber Source
                        </span>}

                      {isConfirmed && <span className="inline-flex items-center gap-1 font-medium text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                          Community Confirmed Report
                        </span>}

                      {!isOfficial && !isConfirmed && <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          Field Observation
                        </span>}
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <h3 className="font-bold text-base text-[#142B4A]">{item.title}</h3>
                  <p className="text-xs text-[#172B4D] mt-1.5 leading-relaxed">{item.summary}</p>
                  
                  {item.details && item.details !== item.summary && <p className="text-xs text-[#64748B] mt-2 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {item.details}
                    </p>}

                  {
      /* Mandi Price or Border Queue telemetry badge */
    }
                  {(item.priceDetails || item.waitingTimeHours) && <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                      {item.waitingTimeHours && <div className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          Estimated Customs Queue: ~{item.waitingTimeHours} Hours
                        </div>}

                      {item.priceDetails && <div className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                          {item.priceDetails}
                        </div>}
                    </div>}

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <div>
                      Reported by: <span className="font-semibold text-slate-700">{item.sourceName || item.authorName}</span>
                    </div>
                    <span className="capitalize">{item.category.replace(/_/g, " ")}</span>
                  </div>
                </div>;
  })}
          </div> : <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-base text-[#142B4A]">No reports found</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting the corridor or category filters.</p>
          </div>}

        {
    /* Modal: Submit Corridor Report */
  }
        {showModal && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-base text-[#142B4A]">Submit Corridor Field Update</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
              </div>

              {formSuccess ? <div className="py-10 text-center text-emerald-600">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-emerald-500" />
                  <p className="font-bold text-sm">Report Published to BorderPulse!</p>
                </div> : <form onSubmit={handleCreate} className="space-y-4 mt-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Report Headline *</label>
                    <input
    type="text"
    required
    placeholder="e.g. Taftan Gate 2: Clearance normal for reefer trucks"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
  />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
                      <select
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
  >
                        <option value="border_crossing">Border Crossing & Customs</option>
                        <option value="market_prices">Mandi Price Index</option>
                        <option value="road_condition">Highway Condition</option>
                        <option value="regulation_update">Regulatory Notice</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Corridor Location *</label>
                      <input
    type="text"
    required
    value={locationCorridor}
    onChange={(e) => setLocationCorridor(e.target.value)}
    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
  />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Brief Summary *</label>
                    <input
    type="text"
    required
    placeholder="Concise overview visible on corridor summary feeds"
    value={summary}
    onChange={(e) => setSummary(e.target.value)}
    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
  />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Observations</label>
                    <textarea
    rows={3}
    placeholder="Provide specific terminal gates, document requirements, or scanner operational status..."
    value={details}
    onChange={(e) => setDetails(e.target.value)}
    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
  />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Queue Waiting Time (Hours)</label>
                      <input
    type="number"
    placeholder="e.g. 4"
    value={waitingTimeHours}
    onChange={(e) => setWaitingTimeHours(e.target.value)}
    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
  />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Price Observations (if any)</label>
                      <input
    type="text"
    placeholder="e.g. Apples: $820/MT FOB Quetta"
    value={priceDetails}
    onChange={(e) => setPriceDetails(e.target.value)}
    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
  />
                    </div>
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
                      {submitting ? "Publishing..." : "Submit Report"}
                    </button>
                  </div>
                </form>}
            </div>
          </div>}
      </div>
    </AppShell>;
}
