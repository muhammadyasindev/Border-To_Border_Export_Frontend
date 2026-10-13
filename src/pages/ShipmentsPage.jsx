import { Link, useNavigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { AppShell } from "../components/layout/AppShell.jsx";
import { StatusBadge } from "../components/ui/StatusBadge.jsx";
import {
  Compass,
  Truck,
  Navigation,
  Radio,
  FileText
} from "lucide-react";
export default function ShipmentsPage() {
  const [shipments, setShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newCheckpoint, setNewCheckpoint] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const loadShipments = async (preferredId) => {
    try {
      const res = await fetch("/api/shipments");
      const data = await res.json();
      const list = data.shipments || [];
      setShipments(list);
      if (preferredId) {
        const found = list.find((s) => s.id === preferredId);
        if (found) setSelectedShipment(found);
      } else if (list.length > 0 && !selectedShipment) {
        setSelectedShipment(list[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    let prefId;
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const idParam = params.get("id");
      if (idParam) prefId = Number(idParam);
    }
    loadShipments(prefId);
  }, []);
  const handleUpdateTrip = async (e) => {
    e.preventDefault();
    if (!selectedShipment) return;
    setUpdating(true);
    try {
      const res = await fetch("/api/shipments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shipmentId: selectedShipment.id,
          status: newStatus || void 0,
          lastCheckpoint: newCheckpoint || void 0,
          latitude: selectedShipment.currentLatitude ? (Number(selectedShipment.currentLatitude) + 0.05).toFixed(4) : "29.2000",
          longitude: selectedShipment.currentLongitude ? (Number(selectedShipment.currentLongitude) - 0.1).toFixed(4) : "64.1000"
        })
      });
      if (res.ok) {
        await loadShipments(selectedShipment.id);
        setNewCheckpoint("");
      }
    } catch (e2) {
      console.error(e2);
    } finally {
      setUpdating(false);
    }
  };
  return <AppShell>
      <div className="space-y-6">
        {
    /* Top Header */
  }
        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#142B4A]">
              Consignment Tracking & Corridor Dispatch
            </h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              Permission-based cross-border tracking between exporter, buyer, and confirmed haulage driver.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold px-3 py-1.5 rounded-lg">
              <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              Active Route GPS Live
            </span>
          </div>
        </div>

        {loading ? <div className="h-64 bg-white rounded-xl border border-slate-200 animate-pulse" /> : shipments.length > 0 ? <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {
    /* Left 1 Col: Shipment List */
  }
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Active Shipments ({shipments.length})
              </h3>
              {shipments.map((s) => {
    const isSelected = selectedShipment?.id === s.id;
    return <div
      key={s.id}
      onClick={() => setSelectedShipment(s)}
      className={`bg-white rounded-xl p-4 border transition cursor-pointer shadow-xs ${isSelected ? "border-blue-600 ring-1 ring-blue-600 bg-blue-50/20" : "border-[#E2E8F0] hover:border-slate-300"}`}
    >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-[#142B4A]">
                        {s.trackingNumber}
                      </span>
                      <StatusBadge status={s.status} size="sm" />
                    </div>

                    <h4 className="font-semibold text-xs text-[#172B4D] line-clamp-1">
                      {s.cargoDescription}
                    </h4>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Weight: {s.cargoWeightTons} MT • Crossing: {s.borderCrossing}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Driver:</span>
                      <span className="font-medium text-slate-700">{s.driver?.fullName}</span>
                    </div>
                  </div>;
  })}
            </div>

            {
    /* Right 2 Cols: Selected Shipment Details & Interactive Corridor Tracker */
  }
            {selectedShipment && <div className="lg:col-span-2 space-y-5">
                {
    /* Visual Tracking Map Card */
  }
                <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                        Consignment Dossier
                      </span>
                      <h3 className="font-bold text-base text-[#142B4A]">
                        {selectedShipment.cargoDescription} ({selectedShipment.cargoWeightTons} Metric Tons)
                      </h3>
                    </div>
                    <StatusBadge status={selectedShipment.status} />
                  </div>

                  {
    /* Corridor Route Visualizer / Schematic Map */
  }
                  <div className="p-5 bg-gradient-to-b from-slate-900 to-[#0e1e33] text-white relative overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Origin Dispatch</div>
                        <div className="text-sm font-bold text-white mt-0.5">{selectedShipment.pickupLocation}</div>
                      </div>

                      <div className="flex-1 flex flex-col items-center px-4">
                        <div className="text-[10px] text-blue-300 font-semibold mb-1 flex items-center gap-1">
                          <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                          Crossing: {selectedShipment.borderCrossing}
                        </div>
                        <div className="w-full h-1.5 bg-slate-700 rounded-full relative flex items-center justify-between">
                          <div className="w-3 h-3 rounded-full bg-blue-500" />
                          <div className="w-4 h-4 rounded-full bg-emerald-400 ring-4 ring-emerald-400/30" />
                          <div className="w-3 h-3 rounded-full bg-slate-500" />
                        </div>
                        <div className="text-[10px] text-slate-300 mt-1">
                          Last Checkpoint: <span className="font-bold text-white">{selectedShipment.lastCheckpoint}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Final Destination</div>
                        <div className="text-sm font-bold text-white mt-0.5">{selectedShipment.destinationLocation}</div>
                      </div>
                    </div>

                    {
    /* GPS Coordinates telemetry */
  }
                    <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-300">
                      <div>
                        Telemetry:{" "}
                        <span className="font-mono text-emerald-400 font-semibold">
                          {selectedShipment.currentLatitude && selectedShipment.currentLongitude ? `${selectedShipment.currentLatitude}\xB0 N, ${selectedShipment.currentLongitude}\xB0 E` : "Protected / Arrived"}
                        </span>
                      </div>
                      <div>
                        Est. Arrival: <span className="font-semibold text-white">{selectedShipment.estimatedDeliveryDate}</span>
                      </div>
                    </div>
                  </div>

                  {
    /* Route & Vehicle Specifications */
  }
                  <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                      <div className="font-bold text-[#142B4A] flex items-center gap-1.5 mb-2">
                        <Truck className="w-4 h-4 text-blue-600" />
                        Vehicle & Driver Credentials
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Driver Name:</span>
                        <span className="font-semibold text-slate-800">{selectedShipment.driver?.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Driver Phone:</span>
                        <span className="font-mono text-slate-800">{selectedShipment.driver?.phone || "Direct in deal room"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Vehicle Type:</span>
                        <span className="font-semibold text-slate-800">{selectedShipment.vehicle?.vehicleType || "Commercial Trailer"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Plate (Masked):</span>
                        <span className="font-mono font-bold text-blue-800">{selectedShipment.vehicle?.plateNumberMasked || "Masked for transit"}</span>
                      </div>
                    </div>

                    <div className="space-y-2 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                      <div className="font-bold text-[#142B4A] flex items-center gap-1.5 mb-2">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        Commercial Consignment Status
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Tracking Code:</span>
                        <span className="font-mono font-bold text-slate-800">{selectedShipment.trackingNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Scheduled Pickup:</span>
                        <span className="font-semibold text-slate-800">{selectedShipment.scheduledPickupDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Bilateral Crossing:</span>
                        <span className="font-semibold text-slate-800">{selectedShipment.borderCrossing}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Security Clearance:</span>
                        <span className="font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          Pass WebOC/ASYCUDA Issued
                        </span>
                      </div>
                    </div>
                  </div>

                  {
    /* Driver Operational Control: Push Checkpoint */
  }
                  <div className="p-5 border-t border-slate-200 bg-slate-50/50">
                    <h4 className="font-bold text-xs text-[#142B4A] mb-2 flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-blue-600" />
                      Driver Dispatch & Status Push
                    </h4>
                    <p className="text-[11px] text-slate-500 mb-3">
                      Authorized drivers and exporters can record checkpoints as the goods move along the transit corridor.
                    </p>

                    <form onSubmit={handleUpdateTrip} className="flex flex-col sm:flex-row items-center gap-3">
                      <input
    type="text"
    placeholder="e.g. Taftan Border Terminal Gate 2, Mirjaveh Customs"
    value={newCheckpoint}
    onChange={(e) => setNewCheckpoint(e.target.value)}
    className="flex-1 text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none"
  />

                      <select
    value={newStatus}
    onChange={(e) => setNewStatus(e.target.value)}
    className="text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none"
  >
                        <option value="">Update Status...</option>
                        <option value="in_transit_to_border">In Transit to Border</option>
                        <option value="border_clearance">At Customs Clearance</option>
                        <option value="crossed_border">Border Crossed Successfully</option>
                        <option value="delivered">Delivered to Destination</option>
                      </select>

                      <button
    type="submit"
    disabled={updating}
    className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg shadow-xs transition"
  >
                        {updating ? "Updating..." : "Push Checkpoint"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>}
          </div> : <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-base text-[#142B4A]">No shipments currently recorded</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Once an exporter and importer agree on a deal and confirm transport haulage, live corridor tracking appears here.
            </p>
          </div>}
      </div>
    </AppShell>;
}
