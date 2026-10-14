import { Link, useNavigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { AppShell } from "../components/layout/AppShell.jsx";
import { StatusBadge } from "../components/ui/StatusBadge.jsx";
import {
  FileText,
  PlusCircle,
  CheckCircle2
} from "lucide-react";
import { EditableSelect } from "../components/ui/EditableSelect.jsx";
import {
  CORRIDOR_CURRENCIES,
  BORDER_COUNTRIES,
  CORRIDOR_CITIES,
  TRADE_CATEGORIES,
  TRADE_UNITS,
  getCitiesForCountry,
  getCurrencyForCountry
} from "../lib/constants.js";
import { safeFetch } from "../lib/api.js";
export default function DemandsPage() {
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [specifications, setSpecifications] = useState("");
  const [quantityRequired, setQuantityRequired] = useState("");
  const [unit, setUnit] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [currency, setCurrency] = useState("");
  const [preferredOrigin, setPreferredOrigin] = useState("");
  const [destinationCountry, setDestinationCountry] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [deliveryDeadline, setDeliveryDeadline] = useState("");
  const [packagingRequirements, setPackagingRequirements] = useState("");
  const loadDemands = async () => {
    try {
      const res = await safeFetch("/api/demands?myOnly=true");
      const data = res.data;
      setDemands(data?.demands || (Array.isArray(data) ? data : []));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadDemands();
    if (typeof window !== "undefined" && window.location.search.includes("action=new")) {
      setShowModal(true);
    }
  }, []);
  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await safeFetch("/api/demands", {
        method: "POST",
        body: JSON.stringify({
          title,
          category,
          specifications,
          quantityRequired,
          unit,
          targetPrice: targetPrice ? Number(targetPrice) : null,
          currency,
          preferredOrigin,
          destinationCountry,
          destinationCity,
          deliveryDeadline,
          packagingRequirements
        })
      });
      if (res.ok) {
        setFormSuccess(true);
        setTimeout(() => {
          setShowModal(false);
          setFormSuccess(false);
          loadDemands();
        }, 800);
      } else {
        const d = await res.json();
        alert(d.error || "Failed to post demand");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };
  return <AppShell>
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#142B4A]">
              My Purchase Demands (RFQs)
            </h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              Publish buying requirements to receive quotations from vetted exporters in cross-border corridors.
            </p>
          </div>

          <button
    onClick={() => setShowModal(true)}
    className="inline-flex items-center gap-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-medium text-xs px-3.5 py-2 rounded-lg shadow-xs transition"
  >
            <PlusCircle className="w-4 h-4" />
            Post New Demand
          </button>
        </div>

        {loading ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => <div key={i} className="h-44 bg-white rounded-xl border border-slate-200 animate-pulse" />)}
          </div> : demands.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {demands.map((d) => <div
    key={d.id}
    className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 flex flex-col justify-between"
  >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      RFQ: {d.category}
                    </span>
                    <StatusBadge status={d.status} size="sm" />
                  </div>

                  <h3 className="font-bold text-sm text-[#142B4A]">{d.title}</h3>
                  <p className="text-xs text-[#64748B] mt-1">{d.specifications}</p>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-slate-500">Volume:</span>{" "}
                      <span className="font-semibold text-slate-800">{d.quantityRequired} {d.unit}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Target Budget:</span>{" "}
                      <span className="font-semibold text-emerald-700">${d.targetPrice || "Negotiable"}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Preferred Origin:</span>{" "}
                      <span className="font-semibold text-slate-800">{d.preferredOrigin}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Destination:</span>{" "}
                      <span className="font-semibold text-slate-800">{d.destinationCity}, {d.destinationCountry}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Deadline: {d.deliveryDeadline}</span>
                  <Link to="/conversations" className="text-blue-600 font-medium hover:underline">
                    View Inquiries →
                  </Link>
                </div>
              </div>)}
          </div> : <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-base text-[#142B4A]">No purchase demands published</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Post an active demand to inform exporters of the specific goods, quantities, and quality standards you wish to import.
            </p>
            <button
    onClick={() => setShowModal(true)}
    className="mt-4 inline-flex items-center gap-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-medium text-xs px-4 py-2 rounded-lg transition"
  >
              <PlusCircle className="w-4 h-4" />
              Post Your First Demand
            </button>
          </div>}

        {
    /* Modal */
  }
        {showModal && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-base text-[#142B4A]">Post Purchase Demand (RFQ)</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
              </div>

              {formSuccess ? <div className="py-12 text-center text-emerald-600">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-emerald-500" />
                  <p className="font-bold text-sm">Demand Published Successfully!</p>
                </div> : <form onSubmit={handleCreate} className="space-y-4 mt-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Requirement Title *</label>
                    <input
    type="text"
    required
    placeholder="e.g. 200 MT White Basmati Rice, 50 MT Cold-Pressed Oils"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
  />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <EditableSelect
    label="Product Category *"
    value={category}
    onChange={setCategory}
    options={TRADE_CATEGORIES}
  />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Quantity Required *</label>
                      <input
    type="number"
    required
    placeholder="e.g. 150"
    value={quantityRequired}
    onChange={(e) => setQuantityRequired(e.target.value)}
    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
  />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Specifications *</label>
                    <textarea
    rows={3}
    required
    placeholder="Grade specifications, maximum allowable moisture, purity percentages, certificate requirements..."
    value={specifications}
    onChange={(e) => setSpecifications(e.target.value)}
    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
  />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <EditableSelect
    label="Measurement Unit *"
    value={unit}
    onChange={setUnit}
    options={TRADE_UNITS}
  />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Target Budget Amount</label>
                      <input
    type="number"
    placeholder="e.g. 580"
    value={targetPrice}
    onChange={(e) => setTargetPrice(e.target.value)}
    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
  />
                    </div>

                    <div>
                      <EditableSelect
    label="Target Currency *"
    value={currency}
    onChange={setCurrency}
    options={CORRIDOR_CURRENCIES}
  />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <EditableSelect
    label="Preferred Origin"
    value={preferredOrigin}
    onChange={setPreferredOrigin}
    options={BORDER_COUNTRIES}
  />
                    </div>

                    <div>
                      <EditableSelect
    label="Destination Country *"
    value={destinationCountry}
    onChange={(val) => {
      setDestinationCountry(val);
      setCurrency(getCurrencyForCountry(val));
      const available = getCitiesForCountry(val);
      if (available.length > 0) {
        setDestinationCity(available[0].value);
      }
    }}
    options={BORDER_COUNTRIES}
  />
                    </div>

                    <div>
                      <EditableSelect
    label="Destination City *"
    value={destinationCity}
    onChange={setDestinationCity}
    options={getCitiesForCountry(destinationCountry)}
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
                      {submitting ? "Publishing..." : "Publish Demand"}
                    </button>
                  </div>
                </form>}
            </div>
          </div>}
      </div>
    </AppShell>;
}
