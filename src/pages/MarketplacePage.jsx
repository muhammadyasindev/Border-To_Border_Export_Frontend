import { Link, useNavigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { AppShell } from "../components/layout/AppShell.jsx";
import { TrustShield } from "../components/ui/StatusBadge.jsx";
import {
  Package,
  FileText,
  Truck,
  Search,
  MapPin,
  MessageSquare
} from "lucide-react";
export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState("products");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [products, setProducts] = useState([]);
  const [demands, setDemands] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get("tab");
      if (tabParam === "demands" || tabParam === "transport" || tabParam === "products") {
        setActiveTab(tabParam);
      }
    }
  }, []);
  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, demRes, offRes] = await Promise.all([
        fetch(`/api/products?search=${encodeURIComponent(search)}&category=${encodeURIComponent(filterCategory)}&origin=${encodeURIComponent(filterCountry)}`),
        fetch(`/api/demands?search=${encodeURIComponent(search)}`),
        fetch(`/api/transport?search=${encodeURIComponent(search)}`)
      ]);
      const prodData = await prodRes.json();
      const demData = await demRes.json();
      const offData = await offRes.json();
      setProducts(prodData.products || []);
      setDemands(demData.demands || []);
      setOffers(offData.offers || []);
    } catch (e) {
      console.error("Error loading marketplace:", e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [search, filterCategory, filterCountry]);
  return <AppShell>
      <div className="space-y-6">
        {
    /* Top Header */
  }
        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#142B4A]">
              Cross-Border Trade Marketplace
            </h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              Discover verified export supplies, active buyer RFQ demands, and transport hauliers across Pakistan, Iran, and Afghanistan.
            </p>
          </div>

          {
    /* Quick Create Actions */
  }
          <div className="flex items-center gap-2">
            <Link
    to="/products?action=new"
    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition"
  >
              + Sell Product
            </Link>
            <Link
    to="/demands?action=new"
    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition"
  >
              + Post Demand
            </Link>
            <Link
    to="/transport?action=new"
    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition"
  >
              + Offer Haulage
            </Link>
          </div>
        </div>

        {
    /* Category Tabs Switcher */
  }
        <div className="flex items-center border-b border-slate-200 bg-white px-4 pt-2 rounded-t-xl gap-2">
          <button
    onClick={() => setActiveTab("products")}
    className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition ${activeTab === "products" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
  >
            <Package className="w-4 h-4" />
            Products for Sale ({products.length})
          </button>
          <button
    onClick={() => setActiveTab("demands")}
    className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition ${activeTab === "demands" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
  >
            <FileText className="w-4 h-4" />
            Buyer Demands / RFQ ({demands.length})
          </button>
          <button
    onClick={() => setActiveTab("transport")}
    className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition ${activeTab === "transport" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
  >
            <Truck className="w-4 h-4" />
            Transport & Freight Offers ({offers.length})
          </button>
        </div>

        {
    /* Filter and Search Bar */
  }
        <div className="bg-white p-3.5 rounded-b-xl border border-t-0 border-[#E2E8F0] shadow-xs flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
    type="text"
    placeholder={`Search in ${activeTab}... (e.g. Kinnow, Basmati, Bitumen, Reefer)`}
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
  />
          </div>

          {activeTab === "products" && <>
              <select
    value={filterCategory}
    onChange={(e) => setFilterCategory(e.target.value)}
    className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
  >
                <option value="">All Categories</option>
                <option value="Agricultural">Agricultural Produce</option>
                <option value="Dry Fruits">Dry Fruits & Nuts</option>
                <option value="Chemicals & Minerals">Chemicals & Minerals</option>
                <option value="Textiles">Textiles & Garments</option>
                <option value="Construction">Construction Materials</option>
              </select>

              <select
    value={filterCountry}
    onChange={(e) => setFilterCountry(e.target.value)}
    className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
  >
                <option value="">All Origins</option>
                <option value="Pakistan">Pakistan</option>
                <option value="Iran">Iran</option>
                <option value="Afghanistan">Afghanistan</option>
              </select>
            </>}
        </div>

        {
    /* Listing Results Grid */
  }
        {loading ? <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-48 bg-white rounded-xl border border-slate-200 animate-pulse" />)}
          </div> : <div>
            {
    /* 1. Products Tab */
  }
            {activeTab === "products" && (products.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {products.map((item) => <div
    key={item.id}
    className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden flex flex-col hover:border-blue-300 transition"
  >
                      {item.imageUrl && <div className="h-40 bg-slate-100 overflow-hidden relative">
                          <img
    src={item.imageUrl}
    alt={item.title}
    className="w-full h-full object-cover"
  />
                          <div className="absolute top-2.5 right-2.5">
                            <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                              {item.category}
                            </span>
                          </div>
                        </div>}

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {item.originCity}, {item.originCountry}
                            </span>
                            <TrustShield verified={item.exporterVerificationStatus === "verified"} />
                          </div>

                          <h3 className="font-bold text-sm text-[#142B4A] line-clamp-1">{item.title}</h3>
                          <p className="text-xs text-[#64748B] mt-1 line-clamp-2">{item.description}</p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="text-lg font-extrabold text-[#142B4A]">
                              ${item.pricePerUnit}
                            </span>
                            <span className="text-[11px] text-slate-500"> / {item.unit}</span>
                            <div className="text-[10px] text-emerald-700 font-medium">
                              Avail: {item.quantityAvailable} {item.unit}
                            </div>
                          </div>

                          <Link
    to={`/conversations?newDeal=product&id=${item.id}&targetUserId=${item.exporterId}&title=${encodeURIComponent(item.title)}`}
    className="inline-flex items-center gap-1 bg-[#2563EB] hover:bg-blue-700 text-white font-medium text-xs px-3 py-1.5 rounded-lg transition"
  >
                            <MessageSquare className="w-3.5 h-3.5" />
                            Send Inquiry
                          </Link>
                        </div>
                      </div>
                    </div>)}
                </div> : <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                  <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <h4 className="font-bold text-sm text-slate-700">No export products found</h4>
                  <p className="text-xs text-slate-500 mt-1">Try adjusting your category or corridor search filters.</p>
                </div>)}

            {
    /* 2. Demands Tab */
  }
            {activeTab === "demands" && (demands.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {demands.map((item) => <div
    key={item.id}
    className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-4 flex flex-col justify-between hover:border-blue-300 transition"
  >
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                          <span className="bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded text-[10px] border border-blue-100">
                            RFQ: {item.category}
                          </span>
                          <TrustShield verified={item.buyerVerificationStatus === "verified"} />
                        </div>

                        <h3 className="font-bold text-sm text-[#142B4A]">{item.title}</h3>
                        <p className="text-xs text-[#64748B] mt-1.5 line-clamp-3">
                          {item.specifications}
                        </p>

                        <div className="mt-3 space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Volume Required:</span>
                            <span className="font-semibold text-slate-800">{item.quantityRequired} {item.unit}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Destination:</span>
                            <span className="font-semibold text-slate-800">{item.destinationCity}, {item.destinationCountry}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Target Budget:</span>
                            <span className="font-semibold text-emerald-700">${item.targetPrice || "Negotiable"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="text-[11px] text-slate-500">
                          Buyer: <span className="font-medium text-slate-700">{item.buyerName}</span>
                        </div>

                        <Link
    to={`/conversations?newDeal=demand&id=${item.id}&targetUserId=${item.buyerId}&title=${encodeURIComponent(item.title)}`}
    className="inline-flex items-center gap-1 bg-[#2563EB] hover:bg-blue-700 text-white font-medium text-xs px-3 py-1.5 rounded-lg transition"
  >
                          <MessageSquare className="w-3.5 h-3.5" />
                          Quote Price
                        </Link>
                      </div>
                    </div>)}
                </div> : <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <h4 className="font-bold text-sm text-slate-700">No purchase demands found</h4>
                  <p className="text-xs text-slate-500 mt-1">Importers post demands for bulk agricultural and industrial goods.</p>
                </div>)}

            {
    /* 3. Transport Offers Tab */
  }
            {activeTab === "transport" && (offers.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {offers.map((item) => <div
    key={item.id}
    className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-4 flex flex-col justify-between hover:border-blue-300 transition"
  >
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                          <span className="bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded text-[10px] border border-indigo-100">
                            {item.vehicleType || "Haulage Truck"}
                          </span>
                          <TrustShield verified={item.driverVerificationStatus === "verified"} />
                        </div>

                        <h3 className="font-bold text-sm text-[#142B4A]">{item.title}</h3>

                        <div className="mt-3 space-y-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Route Corridor:</span>
                            <span className="font-semibold text-blue-900">{item.originCorridor} → {item.destinationCorridor}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Payload Capacity:</span>
                            <span className="font-semibold text-slate-800">{item.availableCapacityTons} Metric Tons</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Permitted Cargo:</span>
                            <span className="font-semibold text-slate-800">{item.cargoCategory}</span>
                          </div>
                          {item.plateNumberMasked && <div className="flex items-center justify-between">
                              <span className="text-slate-500">Vehicle Reg:</span>
                              <span className="font-mono text-[11px] font-semibold text-slate-700">{item.plateNumberMasked}</span>
                            </div>}
                        </div>

                        {item.specialConditions && <p className="text-[11px] text-slate-500 italic mt-2">
                            "{item.specialConditions}"
                          </p>}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-lg font-extrabold text-[#142B4A]">
                            ${item.ratePerKmOrTrip}
                          </span>
                          <span className="text-[11px] text-slate-500"> ({item.pricingUnit})</span>
                        </div>

                        <Link
    to={`/conversations?newDeal=transport&id=${item.id}&targetUserId=${item.driverId}&title=${encodeURIComponent(item.title)}`}
    className="inline-flex items-center gap-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-medium text-xs px-3 py-1.5 rounded-lg shadow-xs transition"
  >
                          <Truck className="w-3.5 h-3.5" />
                          Get Offer / Book Vehicle
                        </Link>
                      </div>
                    </div>)}
                </div> : <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                  <Truck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <h4 className="font-bold text-sm text-slate-700">No transport haulage offers found</h4>
                  <p className="text-xs text-slate-500 mt-1">Drivers advertise cross-border truck capacity here.</p>
                </div>)}
          </div>}
      </div>
    </AppShell>;
}
