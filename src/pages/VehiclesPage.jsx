import { Link, useNavigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { AppShell } from "../components/layout/AppShell.jsx";
import { StatusBadge } from "../components/ui/StatusBadge.jsx";
import {
  Truck,
  PlusCircle,
  CheckCircle2,
  Lock,
  UploadCloud,
  FileCheck,
  X
} from "lucide-react";
import { EditableSelect } from "../components/ui/EditableSelect.jsx";
import { BORDER_COUNTRIES } from "../lib/constants.js";
import { safeFetch } from "../lib/api.js";
export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [vehicleType, setVehicleType] = useState("");
  const [makeModel, setMakeModel] = useState("");
  const [registrationCountry, setRegistrationCountry] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [capacityTons, setCapacityTons] = useState("");
  const [supportedCargo, setSupportedCargo] = useState("");
  const [supportedCorridors, setSupportedCorridors] = useState("");
  const [docFile, setDocFile] = useState(null);
  const [docFileName, setDocFileName] = useState("");
  const [docFileSize, setDocFileSize] = useState("");
  const loadVehicles = async () => {
    try {
      const res = await safeFetch("/api/vehicles");
      const data = res.data;
      setVehicles(data?.vehicles || (Array.isArray(data) ? data : []));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadVehicles();
    if (typeof window !== "undefined" && window.location.search.includes("action=new")) {
      setShowModal(true);
    }
  }, []);
  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await safeFetch("/api/vehicles", {
        method: "POST",
        body: JSON.stringify({
          vehicleType,
          makeModel,
          registrationCountry,
          plateNumber,
          capacityTons,
          supportedCargo,
          supportedCorridors
        })
      });
      if (res.ok) {
        setFormSuccess(true);
        setTimeout(() => {
          setShowModal(false);
          setFormSuccess(false);
          loadVehicles();
        }, 800);
      } else {
        const d = await res.json();
        alert(d.error || "Failed to register vehicle");
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
              My Commercial Vehicles
            </h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              Manage your fleet documentation, registration fitness, and payload capacity. Full plate numbers are protected for privacy.
            </p>
          </div>

          <button
    onClick={() => setShowModal(true)}
    className="inline-flex items-center gap-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-medium text-xs px-3.5 py-2 rounded-lg shadow-xs transition"
  >
            <PlusCircle className="w-4 h-4" />
            Add Vehicle
          </button>
        </div>

        {
    /* Privacy Assurance Notice */
  }
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center gap-3 text-xs text-slate-600">
          <Lock className="w-4 h-4 text-slate-500 shrink-0" />
          <span>
            <strong>Driver Privacy Protection:</strong> Unrelated public marketplace visitors only see masked plates (e.g., BLN-***-9921). Exact plates are unlocked strictly to confirmed booking counterparties and compliance officers.
          </span>
        </div>

        {loading ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => <div key={i} className="h-44 bg-white rounded-xl border border-slate-200 animate-pulse" />)}
          </div> : vehicles.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {vehicles.map((v) => <div
    key={v.id}
    className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 flex flex-col justify-between"
  >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#142B4A]">
                      {v.vehicleType}
                    </span>
                    <StatusBadge status={v.verificationStatus} size="sm" />
                  </div>

                  <div className="text-sm font-semibold text-slate-800">{v.makeModel}</div>
                  
                  <div className="mt-3 space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Public Masked Plate:</span>
                      <span className="font-mono font-bold text-slate-700">{v.plateNumberMasked}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Authorized Full Plate:</span>
                      <span className="font-mono text-blue-700 font-semibold">{v.plateNumberFull}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Payload Capacity:</span>
                      <span className="font-semibold text-slate-800">{v.capacityTons} Metric Tons</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Supported Corridors:</span>
                      <span className="font-semibold text-slate-800">{v.supportedCorridors}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Permitted Cargo:</span>
                      <span className="text-slate-700">{v.supportedCargo}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Available for bookings
                  </span>
                  <Link
    to={`/transport?action=new&vehicleId=${v.id}`}
    className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium px-3 py-1.5 rounded-lg border border-blue-200"
  >
                    Post Offer with this Vehicle
                  </Link>
                </div>
              </div>)}
          </div> : <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-base text-[#142B4A]">No vehicles registered yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Add your heavy transport truck, trailer, or reefer vehicle to publish transport haulage offers.
            </p>
            <button
    onClick={() => setShowModal(true)}
    className="mt-4 inline-flex items-center gap-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-medium text-xs px-4 py-2 rounded-lg transition"
  >
              <PlusCircle className="w-4 h-4" />
              Register Vehicle
            </button>
          </div>}

        {
    /* Modal */
  }
        {showModal && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-base text-[#142B4A]">Register Commercial Vehicle</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
              </div>

              {formSuccess ? <div className="py-12 text-center text-emerald-600">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-emerald-500" />
                  <p className="font-bold text-sm">Vehicle Registered!</p>
                </div> : <form onSubmit={handleCreate} className="space-y-4 mt-4">
                  <EditableSelect
    label="Vehicle Type *"
    value={vehicleType}
    onChange={setVehicleType}
    options={[
      "Heavy Flatbed (3-Axle)",
      "Refrigerated Reefer Trailer (-20\xB0C to +15\xB0C)",
      "Curtain-Sider / Enclosed Box",
      "Tanker (Petroleum & Chemicals)",
      "Container Chassis 40ft",
      "TIR International Semi-Trailer"
    ]}
    placeholder="Select or type vehicle type..."
    required
  />

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Make & Model *</label>
                      <input
    type="text"
    required
    placeholder="e.g. Volvo FH16, Hino 700"
    value={makeModel}
    onChange={(e) => setMakeModel(e.target.value)}
    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
  />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Payload Capacity (Tons) *</label>
                      <input
    type="number"
    required
    placeholder="e.g. 38"
    value={capacityTons}
    onChange={(e) => setCapacityTons(e.target.value)}
    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
  />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <EditableSelect
    label="Registration Country *"
    value={registrationCountry}
    onChange={setRegistrationCountry}
    options={BORDER_COUNTRIES}
    placeholder="Select or type country..."
    required
  />
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Full Plate Number *</label>
                      <input
    type="text"
    required
    placeholder="e.g. BLN-849-9921"
    value={plateNumber}
    onChange={(e) => setPlateNumber(e.target.value)}
    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-mono"
  />
                    </div>
                  </div>

                  <EditableSelect
    label="Supported Corridors"
    value={supportedCorridors}
    onChange={setSupportedCorridors}
    options={[
      "Quetta - Taftan - Mirjaveh",
      "Quetta - Chaman - Kandahar",
      "Gwadar - Rimdan - Chabahar",
      "Peshawar - Torkham - Kabul",
      "Kashgar - Khunjerab - Sost"
    ]}
    placeholder="Select or type corridor route..."
  />

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Supported Cargo Categories</label>
                    <input
    type="text"
    placeholder="e.g. Perishables, Steel, Cement, Dry bulk"
    value={supportedCargo}
    onChange={(e) => setSupportedCargo(e.target.value)}
    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
  />
                  </div>

                  {
    /* Device Document Upload for Vehicle Registration */
  }
                  <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <UploadCloud className="w-4 h-4 text-blue-600" />
                        Vehicle Registration / Fitness Certificate (Upload from Device)
                      </span>
                      {docFileName && <span className="text-[10px] text-emerald-600 font-bold">Selected</span>}
                    </label>

                    {docFileName ? <div className="mt-2 p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2 truncate">
                          <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="text-xs font-medium text-slate-800 truncate">{docFileName}</span>
                          <span className="text-[10px] text-slate-400">({docFileSize})</span>
                        </div>
                        <button
    type="button"
    onClick={() => {
      setDocFile(null);
      setDocFileName("");
      setDocFileSize("");
    }}
    className="text-slate-400 hover:text-rose-500 p-1"
  >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div> : <label className="mt-1 flex flex-col items-center justify-center p-3 border border-dashed border-slate-300 rounded-lg bg-white cursor-pointer hover:bg-blue-50/50 hover:border-blue-400 transition">
                        <UploadCloud className="w-5 h-5 text-slate-400 mb-1" />
                        <span className="text-xs font-medium text-blue-600">Choose scan/doc from your device</span>
                        <span className="text-[10px] text-slate-400">PDF, PNG, JPG (Registration book or Road fitness scan)</span>
                        <input
    type="file"
    accept=".pdf,.png,.jpg,.jpeg,.webp"
    className="hidden"
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (file) {
        setDocFile(file);
        setDocFileName(file.name);
        setDocFileSize((file.size / (1024 * 1024)).toFixed(2) + " MB");
      }
    }}
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
                      {submitting ? "Saving..." : "Save Vehicle"}
                    </button>
                  </div>
                </form>}
            </div>
          </div>}
      </div>
    </AppShell>;
}
