import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { AppShell } from "../components/layout/AppShell.jsx";
import {
  Package,
  ShoppingBag,
  Truck,
  Compass,
  Search,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Handshake,
  Tag,
  Clock,
  Filter,
  ArrowUpDown,
  Coins,
  ChevronRight,
  PlusCircle,
  ExternalLink,
  MessageCircle,
  CheckCircle2,
  X,
  Calendar,
} from "lucide-react";
import { safeFetch } from "../lib/api.js";
import {
  BORDER_COUNTRIES,
  CORRIDOR_CURRENCIES,
  TRADE_CATEGORIES,
  getCurrencyForCountry,
} from "../lib/constants.js";

export default function MarketplacePage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Active Tab: products, offers, demands, transport, transport_requests
  const [activeTab, setActiveTab] = useState("products");

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterCountry, setFilterCountry] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Data collections
  const [products, setProducts] = useState([]);
  const [promotionalOffers, setPromotionalOffers] = useState([]);
  const [demands, setDemands] = useState([]);
  const [transportOffers, setTransportOffers] = useState([]);
  const [transportRequests, setTransportRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItemDetail, setSelectedItemDetail] = useState(null);

  // Sync tab with URL search parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    if (["products", "offers", "demands", "transport", "transport_requests"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
    const searchParam = params.get("search");
    if (searchParam) setSearch(searchParam);
  }, [location.search]);

  // Fetch all marketplace sections
  const fetchMarketplaceData = async () => {
    setLoading(true);
    try {
      const [prodRes, offRes, demRes, transRes, reqRes] = await Promise.all([
        safeFetch(`/api/products?search=${encodeURIComponent(search)}&category=${encodeURIComponent(filterCategory)}&originCountry=${encodeURIComponent(filterCountry)}&minPrice=${minPrice}&maxPrice=${maxPrice}&sortBy=${sortBy}&sortOrder=${sortOrder}`).catch(() => null),
        safeFetch(`/api/products/offers/all?search=${encodeURIComponent(search)}&category=${encodeURIComponent(filterCategory)}&country=${encodeURIComponent(filterCountry)}`).catch(() => null),
        safeFetch(`/api/demands?search=${encodeURIComponent(search)}&category=${encodeURIComponent(filterCategory)}&destinationCountry=${encodeURIComponent(filterCountry)}&minPrice=${minPrice}&maxPrice=${maxPrice}&sortBy=${sortBy}&sortOrder=${sortOrder}`).catch(() => null),
        safeFetch(`/api/transport?search=${encodeURIComponent(search)}`).catch(() => null),
        safeFetch(`/api/transport/requests/all?search=${encodeURIComponent(search)}&cargoCategory=${encodeURIComponent(filterCategory)}`).catch(() => null),
      ]);

      if (prodRes?.ok && prodRes.data) {
        setProducts(prodRes.data.products || (Array.isArray(prodRes.data) ? prodRes.data : []));
      }
      if (offRes?.ok && offRes.data) {
        setPromotionalOffers(Array.isArray(offRes.data) ? offRes.data : []);
      }
      if (demRes?.ok && demRes.data) {
        setDemands(demRes.data.demands || (Array.isArray(demRes.data) ? demRes.data : []));
      }
      if (transRes?.ok && transRes.data) {
        setTransportOffers(transRes.data.offers || (Array.isArray(transRes.data) ? transRes.data : []));
      }
      if (reqRes?.ok && reqRes.data) {
        setTransportRequests(reqRes.data.requests || (Array.isArray(reqRes.data) ? reqRes.data : []));
      }
    } catch (err) {
      console.error("Marketplace fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketplaceData();
  }, [search, filterCategory, filterCountry, minPrice, maxPrice, sortBy, sortOrder]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    navigate(`/marketplace?tab=${newTab}`);
  };

  return (
    <AppShell>
      <div className="space-y-6 font-sans">
        {/* 1. Header Bar */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200 mb-1.5">
              <span>🌐 Regional Cross-Border B2B Ledger</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#142B4A]">
              Unified Corridor Marketplace
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time trading and road haulage opportunities across Pakistan, Iran, Afghanistan, and China.
            </p>
          </div>

          {/* Quick Create Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/products?action=new"
              className="text-xs font-bold px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Package className="w-3.5 h-3.5" />
              <span>+ Sell Product</span>
            </Link>
            <Link
              to="/demands?action=new"
              className="text-xs font-bold px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>+ Post Demand</span>
            </Link>
            <Link
              to="/transport?action=new"
              className="text-xs font-bold px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>+ Offer Haulage</span>
            </Link>
          </div>
        </div>

        {/* 2. Unified 5-Tab Navigation Switcher */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-1.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <button
              onClick={() => handleTabChange("products")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === "products"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products ({products.length})</span>
            </button>

            <button
              onClick={() => handleTabChange("offers")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === "offers"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Promotional Offers ({promotionalOffers.length})</span>
            </button>

            <button
              onClick={() => handleTabChange("demands")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === "demands"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Buyer Demands ({demands.length})</span>
            </button>

            <button
              onClick={() => handleTabChange("transport")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === "transport"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Transport Offers ({transportOffers.length})</span>
            </button>

            <button
              onClick={() => handleTabChange("transport_requests")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === "transport_requests"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Transport Requests ({transportRequests.length})</span>
            </button>
          </div>

          {/* Quick Clear Filters */}
          {(filterCategory !== "All" || filterCountry !== "All" || search || minPrice || maxPrice) && (
            <button
              onClick={() => {
                setSearch("");
                setFilterCategory("All");
                setFilterCountry("All");
                setMinPrice("");
                setMaxPrice("");
              }}
              className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 rounded-lg hover:bg-rose-50 transition cursor-pointer"
            >
              Reset Filters ✕
            </button>
          )}
        </div>

        {/* 3. Comprehensive Filter & Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="lg:col-span-4 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search commodities, specs, corridors, suppliers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
              />
            </div>

            {/* Category Filter */}
            <div className="lg:col-span-3">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700"
              >
                <option value="All">All Categories</option>
                {TRADE_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Country Corridor Filter */}
            <div className="lg:col-span-3">
              <select
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 font-medium"
              >
                <option value="All">🌐 All Corridor Countries</option>
                <option value="Pakistan">🇵🇰 Pakistan (PKR ₨)</option>
                <option value="Iran">🇮🇷 Iran (IRR ﷼)</option>
                <option value="Afghanistan">🇦🇫 Afghanistan (AFN ؋)</option>
                <option value="China">🇨🇳 China (CNY ¥)</option>
              </select>
            </div>

            {/* Sorting */}
            <div className="lg:col-span-2">
              <select
                value={`${sortBy}_${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split("_");
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700"
              >
                <option value="createdAt_desc">Newest First</option>
                <option value="createdAt_asc">Oldest First</option>
                <option value="pricePerUnit_asc">Price: Low to High</option>
                <option value="pricePerUnit_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. Content Area Based on Active Tab */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-slate-200/80 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div>
            {/* TAB 1: EXPORT PRODUCTS */}
            {activeTab === "products" && (
              <div>
                {products.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                    <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <h3 className="font-bold text-sm text-slate-800">No export products match your filters</h3>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your country or category criteria.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((p) => (
                      <div
                        key={p._id || p.id}
                        className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition p-4 sm:p-5 flex flex-col justify-between group"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                              {p.category}
                            </span>
                            {p.activeOffer && (
                              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
                                🔥 {p.activeOffer.discountType === "percentage" ? `${p.activeOffer.discountValue}% OFF` : `Special Offer`}
                              </span>
                            )}
                          </div>

                          <div>
                            <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition truncate">
                              {p.title}
                            </h3>
                            <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                              {p.description}
                            </p>
                          </div>

                          <div className="bg-slate-50 rounded-xl p-2.5 text-xs space-y-1 border border-slate-100">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">Unit Price:</span>
                              <span className="font-extrabold text-slate-900">
                                {p.activeOffer ? (
                                  <span className="flex items-center gap-1.5">
                                    <span className="line-through text-slate-400 font-normal text-[11px]">${p.pricePerUnit}</span>
                                    <span className="text-rose-600 font-extrabold">{p.currency || "USD"} {p.activeOffer.offerPrice}</span>
                                  </span>
                                ) : (
                                  `${p.currency || "USD"} ${Number(p.pricePerUnit).toLocaleString()}`
                                )} / {p.unit}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">Available Stock:</span>
                              <span className="font-semibold text-slate-800">{p.quantityAvailable} {p.unit}</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">Dispatch Origin:</span>
                              <span className="font-medium text-slate-700">{p.originCity}, {p.originCountry}</span>
                            </div>
                          </div>

                          {/* Publisher info */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 truncate">
                              <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                                {p.exporterId?.fullName?.charAt(0) || "E"}
                              </div>
                              <span className="text-slate-700 font-medium truncate">
                                {p.exporterId?.businessName || p.exporterId?.fullName || "Exporter"}
                              </span>
                              {p.exporterId?.verificationStatus === "verified" && (
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" title="Verified Trader" />
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "Active"}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                          <Link
                            to={`/conversations?newDeal=product&id=${p._id || p.id}&title=${encodeURIComponent(p.title)}&targetUserId=${p.exporterId?._id || p.exporterId?.id || (typeof p.exporterId === "string" ? p.exporterId : "")}`}
                            className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Handshake className="w-3.5 h-3.5" />
                            <span>Inquire / Deal Room</span>
                          </Link>
                          {p.exporterId?.phone && (
                            <a
                              href={`https://wa.me/${p.exporterId.phone.replace(/[^0-9]/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-xl border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4 text-emerald-600" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: PROMOTIONAL OFFERS (Special Discounts) */}
            {activeTab === "offers" && (
              <div>
                {promotionalOffers.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                    <Tag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <h3 className="font-bold text-sm text-slate-800">No active promotional offers right now</h3>
                    <p className="text-xs text-slate-400 mt-1">Check back soon for seasonal discounts from regional producers.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {promotionalOffers.map((offer) => (
                      <div
                        key={offer._id || offer.id}
                        className="bg-white rounded-2xl border-2 border-rose-200/90 shadow-2xs hover:shadow-md transition p-4 sm:p-5 flex flex-col justify-between group relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 bg-rose-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl shadow-xs">
                          {offer.discountType === "percentage" ? `${offer.discountValue}% OFF` : `-$${offer.discountValue}`}
                        </div>

                        <div className="space-y-3">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                            Special Promotion
                          </span>

                          <div>
                            <h3 className="font-bold text-base text-slate-900 group-hover:text-rose-600 transition">
                              {offer.title}
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Attached Product: <strong>{offer.productId?.title || "Export Commodity"}</strong>
                            </p>
                          </div>

                          <div className="bg-rose-50/50 rounded-xl p-3 text-xs space-y-1.5 border border-rose-100">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">Original Price:</span>
                              <span className="line-through text-slate-400 font-semibold">
                                {offer.currency} {Number(offer.originalPrice).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-700 font-bold">Offer Price:</span>
                              <span className="text-rose-600 font-black text-sm">
                                {offer.currency} {Number(offer.offerPrice).toLocaleString()} / {offer.productId?.unit || "unit"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">Min Order Qty:</span>
                              <span className="font-semibold text-slate-800">{offer.minQuantity} {offer.productId?.unit || "units"}</span>
                            </div>
                            <div className="flex items-center justify-between text-amber-700 font-semibold pt-1 border-t border-rose-100">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" /> Valid Until:
                              </span>
                              <span>{new Date(offer.validUntil).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="text-slate-600 font-medium truncate">
                              Exporter: {offer.exporterId?.businessName || offer.exporterId?.fullName || "Exporter"}
                            </span>
                            <span className="text-slate-400 text-[10px]">
                              {offer.productId?.originCountry || "Corridor"}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                          <Link
                            to={`/conversations?newDeal=product_offer&id=${offer._id || offer.id}&title=${encodeURIComponent(offer.title)}&targetUserId=${offer.exporterId?._id || offer.exporterId?.id || (typeof offer.exporterId === "string" ? offer.exporterId : "")}`}
                            className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Handshake className="w-3.5 h-3.5" />
                            <span>Claim Offer in Deal Room</span>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: BUYER DEMANDS (RFQs) */}
            {activeTab === "demands" && (
              <div>
                {demands.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                    <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <h3 className="font-bold text-sm text-slate-800">No active buyer demands found</h3>
                    <p className="text-xs text-slate-400 mt-1">Post a demand to inform regional producers of your commodity requirements.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {demands.map((demand) => (
                      <div
                        key={demand._id || demand.id}
                        className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition p-4 sm:p-5 flex flex-col justify-between group"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                              RFQ • {demand.category}
                            </span>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600 text-white capitalize">
                              {demand.status || "active"}
                            </span>
                          </div>

                          <div>
                            <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-600 transition truncate">
                              {demand.title}
                            </h3>
                            <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                              {demand.specifications}
                            </p>
                          </div>

                          <div className="bg-slate-50 rounded-xl p-2.5 text-xs space-y-1 border border-slate-100">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">Volume Required:</span>
                              <span className="font-bold text-slate-900">{demand.quantityRequired} {demand.unit}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">Target Budget:</span>
                              <span className="font-extrabold text-emerald-700">
                                {demand.targetPrice ? `${demand.currency || "USD"} ${Number(demand.targetPrice).toLocaleString()}` : "Negotiable"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">Destination:</span>
                              <span className="font-medium text-slate-700">{demand.destinationCity}, {demand.destinationCountry}</span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 truncate">
                              <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                                {demand.buyerId?.fullName?.charAt(0) || "B"}
                              </div>
                              <span className="text-slate-700 font-medium truncate">
                                {demand.buyerId?.businessName || demand.buyerId?.fullName || "Importer"}
                              </span>
                              {demand.buyerId?.verificationStatus === "verified" && (
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" title="Verified Buyer" />
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {demand.createdAt ? new Date(demand.createdAt).toLocaleDateString() : "Active"}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                          <Link
                            to={`/conversations?newDeal=demand&id=${demand._id || demand.id}&title=${encodeURIComponent(demand.title)}&targetUserId=${demand.buyerId?._id || demand.buyerId?.id || (typeof demand.buyerId === "string" ? demand.buyerId : "")}`}
                            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Handshake className="w-3.5 h-3.5" />
                            <span>Supply / Submit Quotation</span>
                          </Link>
                          {demand.buyerId?.phone && (
                            <a
                              href={`https://wa.me/${demand.buyerId.phone.replace(/[^0-9]/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-xl border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4 text-emerald-600" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: TRANSPORT OFFERS (Published by Drivers) */}
            {activeTab === "transport" && (
              <div>
                {transportOffers.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                    <Truck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <h3 className="font-bold text-sm text-slate-800">No transport offers available</h3>
                    <p className="text-xs text-slate-400 mt-1">Drivers advertise available cargo payload capacity here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {transportOffers.map((offer) => (
                      <div
                        key={offer._id || offer.id}
                        className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition p-4 sm:p-5 flex flex-col justify-between group"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                              {offer.cargoCategory || "Road Freight"}
                            </span>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-600 text-white capitalize">
                              {offer.status || "active"}
                            </span>
                          </div>

                          <div>
                            <h3 className="font-bold text-base text-slate-900 group-hover:text-amber-700 transition truncate">
                              {offer.title}
                            </h3>
                            <div className="text-xs text-slate-600 mt-1 flex items-center gap-1 font-semibold">
                              <span>{offer.originCorridor}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                              <span>{offer.destinationCorridor}</span>
                            </div>
                          </div>

                          <div className="bg-slate-50 rounded-xl p-2.5 text-xs space-y-1 border border-slate-100">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">Available Payload:</span>
                              <span className="font-bold text-slate-900">{offer.availableCapacityTons} Tons</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">Haulage Rate:</span>
                              <span className="font-extrabold text-amber-800">
                                {offer.currency || "USD"} {Number(offer.ratePerKmOrTrip).toLocaleString()} {offer.pricingUnit || "Per Trip"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">Vehicle Type:</span>
                              <span className="font-medium text-slate-700">{offer.vehicleType || "Heavy Articulated Truck"}</span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="text-slate-700 font-medium truncate">
                              Driver: {offer.driverId?.fullName || "Verified Driver"} {offer.driverId?.truckPlateNumber && `(${offer.driverId.truckPlateNumber})`}
                            </span>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {offer.availableDates || "Immediate"}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                          <Link
                            to={`/conversations?newDeal=transport&id=${offer._id || offer.id}&title=${encodeURIComponent(offer.title)}&targetUserId=${offer.driverId?._id || offer.driverId?.id || (typeof offer.driverId === "string" ? offer.driverId : "")}`}
                            className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Compass className="w-3.5 h-3.5" />
                            <span>Book Freight / Deal Room</span>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: TRANSPORT REQUESTS (Published by Importers & Exporters) */}
            {activeTab === "transport_requests" && (
              <div>
                {transportRequests.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                    <Compass className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <h3 className="font-bold text-sm text-slate-800">No transport requests currently published</h3>
                    <p className="text-xs text-slate-400 mt-1">Importers and exporters post cargo shipments needing transportation here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {transportRequests.map((req) => (
                      <div
                        key={req._id || req.id}
                        className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition p-4 sm:p-5 flex flex-col justify-between group"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                              Cargo Request • {req.requesterRole}
                            </span>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-600 text-white capitalize">
                              {req.status || "active"}
                            </span>
                          </div>

                          <div>
                            <h3 className="font-bold text-base text-slate-900 group-hover:text-purple-600 transition truncate">
                              {req.title}
                            </h3>
                            <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                              {req.cargoDescription}
                            </p>
                          </div>

                          <div className="bg-slate-50 rounded-xl p-2.5 text-xs space-y-1 border border-slate-100">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">Route:</span>
                              <span className="font-bold text-slate-800">{req.pickupCity}, {req.pickupCountry} ➔ {req.destinationCity}, {req.destinationCountry}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">Payload Required:</span>
                              <span className="font-bold text-purple-700">{req.quantity} {req.unit}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">Offered Budget:</span>
                              <span className="font-semibold text-slate-900">
                                {req.offeredBudget ? `${req.currency} ${Number(req.offeredBudget).toLocaleString()}` : "Negotiable"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">Vehicle Type:</span>
                              <span className="font-medium text-slate-700">{req.vehicleRequirements || "Heavy Truck"}</span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="text-slate-700 font-medium truncate">
                              Shipper: {req.requesterId?.businessName || req.requesterId?.fullName || "Trader"}
                            </span>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : "Active"}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                          <Link
                            to={`/conversations?newDeal=transport_request&id=${req._id || req.id}&title=${encodeURIComponent(req.title)}&targetUserId=${req.requesterId?._id || req.requesterId?.id || (typeof req.requesterId === "string" ? req.requesterId : "")}`}
                            className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Compass className="w-3.5 h-3.5" />
                            <span>Submit Transport Quotation</span>
                          </Link>
                          {req.requesterId?.phone && (
                            <a
                              href={`https://wa.me/${req.requesterId.phone.replace(/[^0-9]/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-xl border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4 text-emerald-600" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
