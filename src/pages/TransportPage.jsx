import { Link, useNavigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { AppShell } from "../components/layout/AppShell.jsx";
import { TrustShield } from "../components/ui/StatusBadge.jsx";
import {
  Truck,
  PlusCircle,
  MapPin,
  CheckCircle2
} from "lucide-react";
import { EditableSelect } from "../components/ui/EditableSelect.jsx";
import {
  CORRIDOR_CURRENCIES
} from "../lib/constants.js";
import { safeFetch } from "../lib/api.js";
export default function TransportPage() {
  const [offers, setOffers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [vehicleId, setVehicleId] = useState("");
  const [title, setTitle] = useState("");
  const [originCorridor, setOriginCorridor] = useState("");
  const [destinationCorridor, setDestinationCorridor] = useState("");
  const [availableCapacityTons, setAvailableCapacityTons] = useState("");
  const [cargoCategory, setCargoCategory] = useState("");
  const [ratePerKmOrTrip, setRatePerKmOrTrip] = useState("");
  const [currency, setCurrency] = useState("");
  const [pricingUnit, setPricingUnit] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [specialConditions, setSpecialConditions] = useState("");
  const loadData = async () => {
    try {
      const [offRes, vehRes] = await Promise.all([
        safeFetch("/api/transport"),
        safeFetch("/api/vehicles")
      ]);
      const offData = offRes.data;
      const vehData = vehRes.data;
      setOffers(offData?.offers || (Array.isArray(offData) ? offData : []));
      setVehicles(vehData?.vehicles || (Array.isArray(vehData) ? vehData : []));
      if (vehData?.vehicles && vehData.vehicles.length > 0) {
        setVehicleId(vehData.vehicles[0].id.toString());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadData();
    if (typeof window !== "undefined" && window.location.search.includes("action=new")) {
      setShowModal(true);
    }
  }, []);
  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await safeFetch("/api/transport", {
        method: "POST",
        body: JSON.stringify({
          vehicleId: vehicleId ? Number(vehicleId) : null,
          title,
          originCorridor,
          destinationCorridor,
          availableCapacityTons,
          cargoCategory,
          ratePerKmOrTrip,
          pricingUnit,
          currency,
          availableFrom,
          specialConditions
        })
      });
      if (res.ok) {
        setFormSuccess(true);
        setTimeout(() => {
          setShowModal(false);
          setFormSuccess(false);
          loadData();
        }, 800);
      } else {
        const d = await res.json();
        alert(d.error || "Failed to publish offer");
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
              Transport & Freight Services
            </h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              Available commercial truck haulage across Quetta, Taftan, Mirjaveh, Chaman, and Rimdan routes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
    to="/vehicles"
    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
  >
              Manage Fleet / Vehicles
            </Link>
            <button
    onClick={() => setShowModal(true)}
    className="inline-flex items-center gap-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-medium text-xs px-3.5 py-2 rounded-lg shadow-xs transition"
  >
              <PlusCircle className="w-4 h-4" />
              Publish Transport Offer
            </button>
          </div>
        </div>

        {loading ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-44 bg-white rounded-xl border border-slate-200 animate-pulse" />)}
          </div> : offers.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {offers.map((o) => <div
    key={o.id}
    className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 flex flex-col justify-between"
  >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      {o.vehicleType || "Commercial Trailer"}
                    </span>
                    <TrustShield verified={o.driverVerificationStatus === "verified"} />
                  </div>

                  <h3 className="font-bold text-sm text-[#142B4A]">{o.title}</h3>
                  <div className="text-xs font-medium text-blue-800 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>{o.originCorridor}</span>
                    <span>→</span>
                    <span>{o.destinationCorridor}</span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-slate-500">Payload Capacity:</span>{" "}
                      <span className="font-semibold text-slate-800">{o.availableCapacityTons} MT</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Permitted Cargo:</span>{" "}
                      <span className="font-semibold text-slate-800">{o.cargoCategory}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Availability:</span>{" "}
                      <span className="font-semibold text-slate-800">{o.availableFrom}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Vehicle Plate:</span>{" "}
                      <span className="font-mono text-slate-700 font-semibold">{o.plateNumberMasked || "Masked"}</span>
                    </div>
                  </div>

                  {o.specialConditions && <div className="text-[11px] text-slate-600 italic mt-2.5">
                      "{o.specialConditions}"
                    </div>}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-[#142B4A]">
                      {o.currency === "PKR" ? "\u20A8 " : o.currency === "IRR" ? "IRR " : o.currency === "AFN" ? "\u060B " : o.currency === "CNY" ? "\xA5 " : "$ "}
                      {o.ratePerKmOrTrip}
                    </span>
                    <span className="text-xs text-slate-500 font-medium"> {o.currency || "USD"} ({o.pricingUnit})</span>
                  </div>

                    <Link
    to={`/conversations?newDeal=transport&id=${o.id}&targetUserId=${o.driverId}&title=${encodeURIComponent(o.title)}`}
    className="inline-flex items-center gap-1 bg-[#2563EB] hover:bg-blue-700 text-white font-medium text-xs px-3.5 py-1.5 rounded-lg transition"
  >
                      <Truck className="w-3.5 h-3.5" />
                      Get Offer / Book Vehicle
                    </Link>
                </div>
              </div>)}
          </div> : <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-base text-[#142B4A]">No transport offers currently available</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Transporters and vehicle owners advertise available cargo capacity along international trade corridors.
            </p>
          </div>}

        {
    /* Modal */
  }
        {showModal && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-base text-[#142B4A]">Publish Haulage Offer</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
              </div>

              {formSuccess ? <div className="py-12 text-center text-emerald-600">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-emerald-500" />
                  <p className="font-bold text-sm">Transport Offer Published!</p>
                </div> : <form onSubmit={handleCreate} className="space-y-4 mt-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Offer Title *</label>
                    <input
    type="text"
    required
    placeholder="e.g. Heavy Flatbed: Quetta to Taftan Terminal"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
  />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <EditableSelect
    label="Origin / Departure Corridor"
    value={originCorridor}
    onChange={setOriginCorridor}
    options={[
      "Quetta, Pakistan",
      "Karachi Port, Pakistan",
      "Gwadar Port, Pakistan",
      "Lahore Dry Port, Pakistan",
      "Peshawar, Pakistan",
      "Taftan Border Terminal, Pakistan",
      "Chaman Border Terminal, Pakistan",
      "Torkham Border Terminal, Pakistan",
      "Sost Dry Port (Karakoram), Pakistan",
      "Zahedan, Iran",
      "Mirjaveh Border, Iran",
      "Kandahar, Afghanistan",
      "Kabul, Afghanistan",
      "Kashgar, China"
    ]}
    required
  />
                    <EditableSelect
    label="Destination / Crossing Corridor"
    value={destinationCorridor}
    onChange={setDestinationCorridor}
    options={[
      "Taftan / Mirjaveh Border",
      "Chaman / Spin Boldak Border",
      "Torkham / Jalalabad Border",
      "Khunjerab / Tashkurgan Border",
      "Rimdan / Gabd Border",
      "Zahedan Terminal, Iran",
      "Tehran Logistics Hub, Iran",
      "Bandar Abbas Port, Iran",
      "Kabul Central Logistics, Afghanistan",
      "Kashgar Free Trade Zone, China",
      "Karachi Sea Port, Pakistan"
    ]}
    required
  />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Available Payload (Tons) *</label>
                      <input
    type="number"
    required
    placeholder="e.g. 35"
    value={availableCapacityTons}
    onChange={(e) => setAvailableCapacityTons(e.target.value)}
    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
  />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Cargo Types Permitted</label>
                      <input
    type="text"
    value={cargoCategory}
    onChange={(e) => setCargoCategory(e.target.value)}
    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
  />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-1">
                      <EditableSelect
    label="Currency"
    value={currency}
    onChange={setCurrency}
    options={CORRIDOR_CURRENCIES}
    placeholder="Select or type..."
    required
  />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Rate *</label>
                      <input
    type="number"
    required
    placeholder="e.g. 1800"
    value={ratePerKmOrTrip}
    onChange={(e) => setRatePerKmOrTrip(e.target.value)}
    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
  />
                    </div>
                    <div className="col-span-1">
                      <EditableSelect
    label="Pricing Unit"
    value={pricingUnit}
    onChange={setPricingUnit}
    options={["Per Trip", "Per Ton", "Per Km", "Per Container"]}
    required
  />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Special Conditions / TIR Transit</label>
                    <textarea
    rows={2}
    placeholder="e.g. Custom clearance assistance at Taftan included, tarpaulin tied down..."
    value={specialConditions}
    onChange={(e) => setSpecialConditions(e.target.value)}
    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
  />
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
                      {submitting ? "Publishing..." : "Publish Offer"}
                    </button>
                  </div>
                </form>}
            </div>
          </div>}
      </div>
    </AppShell>;
}
