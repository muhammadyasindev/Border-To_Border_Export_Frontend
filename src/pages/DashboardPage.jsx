import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AppShell } from "../components/layout/AppShell.jsx";
import {
  Package,
  ShoppingBag,
  Truck,
  MessageSquare,
  Compass,
  ArrowRight,
  TrendingUp,
  Video,
  ShieldCheck,
  PhoneCall,
  Search,
  Check,
  ChevronRight,
  Handshake,
  Clock,
  Lock,
  PlusCircle,
  AlertCircle,
  UserCheck,
  Globe,
  Coins,
  MapPin,
  ExternalLink,
  MessageCircle,
  X,
  CheckCircle2,
  Filter,
  Trash2,
  Play,
  Pause,
  Tag,
  Sparkles,
  Percent
} from "lucide-react";
import { EditableSelect } from "../components/ui/EditableSelect.jsx";
import {
  BORDER_COUNTRIES,
  CORRIDOR_CURRENCIES,
  CORRIDOR_CITIES,
  TRADE_CATEGORIES,
  TRADE_UNITS,
  getCitiesForCountry,
  getCurrencyForCountry,
} from "../lib/constants.js";
import { safeFetch } from "../lib/api.js";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Active role workspace state
  const cachedRole = localStorage.getItem("user_role");
  const [activeRole, setActiveRole] = useState(cachedRole || "exporter");

  // Country filter & currency state
  const [selectedCountry, setSelectedCountry] = useState("All");

  // Quick action modals
  const [showDemandModal, setShowDemandModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showTransportModal, setShowTransportModal] = useState(false);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalSuccessMsg, setModalSuccessMsg] = useState("");

  // Demand modal state
  const [demandTitle, setDemandTitle] = useState("");
  const [demandCategory, setDemandCategory] = useState("Agricultural");
  const [demandQty, setDemandQty] = useState("");
  const [demandUnit, setDemandUnit] = useState("Metric Tons");
  const [demandPrice, setDemandPrice] = useState("");
  const [demandCountry, setDemandCountry] = useState("Pakistan");
  const [demandCity, setDemandCity] = useState("Quetta");
  const [demandCurrency, setDemandCurrency] = useState("PKR");
  const [demandSpecs, setDemandSpecs] = useState("");

  // Product / Offer modal state
  const [productTitle, setProductTitle] = useState("");
  const [productCategory, setProductCategory] = useState("Agricultural");
  const [productQty, setProductQty] = useState("");
  const [productUnit, setProductUnit] = useState("Metric Tons");
  const [productPrice, setProductPrice] = useState("");
  const [productCountry, setProductCountry] = useState("Pakistan");
  const [productCity, setProductCity] = useState("Quetta");
  const [productCurrency, setProductCurrency] = useState("PKR");
  const [productDesc, setProductDesc] = useState("");

  // Transport modal state
  const [transportTitle, setTransportTitle] = useState("");
  const [transportOrigin, setTransportOrigin] = useState("Quetta, Pakistan");
  const [transportDestination, setTransportDestination] = useState("Taftan / Mirjaveh Border");
  const [transportPayload, setTransportPayload] = useState("");
  const [transportRate, setTransportRate] = useState("");
  const [transportCurrency, setTransportCurrency] = useState("PKR");
  const [transportCargoType, setTransportCargoType] = useState("General Cargo / Commodities");

  // Promotional Offer modal state
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerProductId, setOfferProductId] = useState("");
  const [offerProductTitle, setOfferProductTitle] = useState("");
  const [offerDiscountType, setOfferDiscountType] = useState("percentage");
  const [offerDiscountValue, setOfferDiscountValue] = useState("10");
  const [offerMinQuantity, setOfferMinQuantity] = useState("5");
  const [offerValidDays, setOfferValidDays] = useState("14");
  const [offerNotes, setOfferNotes] = useState("");

  // Transport Request modal state
  const [showTransportRequestModal, setShowTransportRequestModal] = useState(false);
  const [reqCargoDesc, setReqCargoDesc] = useState("");
  const [reqCargoCategory, setReqCargoCategory] = useState("Agricultural");
  const [reqQty, setReqQty] = useState("");
  const [reqUnit, setReqUnit] = useState("Metric Tons");
  const [reqWeight, setReqWeight] = useState("");
  const [reqPickupCountry, setReqPickupCountry] = useState("Pakistan");
  const [reqPickupCity, setReqPickupCity] = useState("Quetta");
  const [reqDestCountry, setReqDestCountry] = useState("Iran");
  const [reqDestCity, setReqDestCity] = useState("Zahedan");
  const [reqPickupDate, setReqPickupDate] = useState("Immediate");
  const [reqDeliveryDeadline, setReqDeliveryDeadline] = useState("Within 5 days");
  const [reqVehicleRequirements, setReqVehicleRequirements] = useState("Standard Flatbed / Container Trailer");
  const [reqBudget, setReqBudget] = useState("");
  const [reqCurrency, setReqCurrency] = useState("USD");
  const [reqSpecialHandling, setReqSpecialHandling] = useState("");

  const loadData = async () => {
    try {
      const [userRes, summaryRes] = await Promise.all([
        safeFetch("/api/auth/me").catch(() => null),
        safeFetch("/api/dashboard/summary").catch(() => null),
      ]);
      if (userRes?.ok && userRes.data?.user) {
        setUser(userRes.data.user);
        if (userRes.data.user.role) {
          setActiveRole(userRes.data.user.role);
          localStorage.setItem("user_role", userRes.data.user.role);
        }
      } else if (cachedRole) {
        setActiveRole(cachedRole);
      }
      if (summaryRes?.ok && summaryRes.data) {
        setSummary(summaryRes.data);
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Switch role tab
  const handleRoleTabSwitch = async (newRole) => {
    setActiveRole(newRole);
    localStorage.setItem("user_role", newRole);
    try {
      await safeFetch("/api/auth/switch-role", {
        method: "POST",
        body: JSON.stringify({ role: newRole }),
      });
      // Re-fetch summary for that role
      const summaryRes = await safeFetch("/api/dashboard/summary").catch(() => null);
      if (summaryRes?.ok && summaryRes.data) {
        setSummary(summaryRes.data);
      }
    } catch (err) {
      console.warn("Role switch sync:", err);
    }
  };

  // Submit Demand (RFQ)
  const handleCreateDemand = async (e) => {
    e.preventDefault();
    setModalSubmitting(true);
    setModalSuccessMsg("");
    try {
      const res = await safeFetch("/api/demands", {
        method: "POST",
        body: JSON.stringify({
          title: demandTitle,
          category: demandCategory,
          quantityRequired: Number(demandQty),
          unit: demandUnit,
          targetPrice: Number(demandPrice) || null,
          currency: demandCurrency,
          destinationCountry: demandCountry,
          destinationCity: demandCity,
          specifications: demandSpecs || "Standard commercial export grade",
        }),
      });
      if (!res.ok) throw new Error(res.error || "Failed to create demand");
      setModalSuccessMsg("Buyer Demand Published Successfully!");
      setTimeout(() => {
        setShowDemandModal(false);
        setModalSuccessMsg("");
        setDemandTitle("");
        setDemandQty("");
        setDemandPrice("");
        setDemandSpecs("");
        loadData();
      }, 1200);
    } catch (err) {
      alert(err.message || "Could not publish demand");
    } finally {
      setModalSubmitting(false);
    }
  };

  // Submit Export Product / Offer
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setModalSubmitting(true);
    setModalSuccessMsg("");
    try {
      const res = await safeFetch("/api/products", {
        method: "POST",
        body: JSON.stringify({
          title: productTitle,
          category: productCategory,
          quantityAvailable: Number(productQty),
          unit: productUnit,
          pricePerUnit: Number(productPrice),
          currency: productCurrency,
          originCountry: productCountry,
          originCity: productCity,
          description: productDesc || "Verified export quality available for cross-border dispatch.",
        }),
      });
      if (!res.ok) throw new Error(res.error || "Failed to publish offer");
      setModalSuccessMsg("Export Offer Published Successfully!");
      setTimeout(() => {
        setShowProductModal(false);
        setModalSuccessMsg("");
        setProductTitle("");
        setProductQty("");
        setProductPrice("");
        setProductDesc("");
        loadData();
      }, 1200);
    } catch (err) {
      alert(err.message || "Could not publish export offer");
    } finally {
      setModalSubmitting(false);
    }
  };

  // Submit Haulage Transport Offer
  const handleCreateTransport = async (e) => {
    e.preventDefault();
    setModalSubmitting(true);
    setModalSuccessMsg("");
    try {
      const res = await safeFetch("/api/transport", {
        method: "POST",
        body: JSON.stringify({
          title: transportTitle,
          originCorridor: transportOrigin,
          destinationCorridor: transportDestination,
          availableCapacityTons: Number(transportPayload),
          ratePerKmOrTrip: Number(transportRate),
          currency: transportCurrency,
          cargoCategory: transportCargoType,
          availableFrom: "Immediate",
        }),
      });
      if (!res.ok) throw new Error(res.error || "Failed to publish transport offer");
      setModalSuccessMsg("Transport Offer Published Successfully!");
      setTimeout(() => {
        setShowTransportModal(false);
        setModalSuccessMsg("");
        setTransportTitle("");
        setTransportPayload("");
        setTransportRate("");
        loadData();
      }, 1200);
    } catch (err) {
      alert(err.message || "Could not publish haulage offer");
    } finally {
      setModalSubmitting(false);
    }
  };

  // Create Product Promotional Offer
  const handleCreateProductOffer = async (e) => {
    e.preventDefault();
    if (!offerProductId) return;
    setModalSubmitting(true);
    setModalSuccessMsg("");
    try {
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + Number(offerValidDays || 14));
      const res = await safeFetch(`/api/products/${offerProductId}/offers`, {
        method: "POST",
        body: JSON.stringify({
          discountType: offerDiscountType,
          discountValue: Number(offerDiscountValue),
          minQuantity: Number(offerMinQuantity) || 1,
          validUntil: validUntil.toISOString(),
          notes: offerNotes,
        }),
      });
      if (!res.ok) throw new Error(res.error || "Failed to create offer");
      setModalSuccessMsg("Promotional Offer Created Successfully!");
      setTimeout(() => {
        setShowOfferModal(false);
        setModalSuccessMsg("");
        setOfferDiscountValue("10");
        loadData();
      }, 1200);
    } catch (err) {
      alert(err.message || "Could not create promotional offer");
    } finally {
      setModalSubmitting(false);
    }
  };

  // Create Independent Transport Request
  const handleCreateTransportRequest = async (e) => {
    e.preventDefault();
    setModalSubmitting(true);
    setModalSuccessMsg("");
    try {
      const res = await safeFetch("/api/transport/requests", {
        method: "POST",
        body: JSON.stringify({
          title: `Cargo Transit: ${reqCargoDesc.slice(0, 40)}`,
          cargoDescription: reqCargoDesc,
          cargoCategory: reqCargoCategory,
          quantity: Number(reqQty),
          unit: reqUnit,
          weightTons: Number(reqWeight) || null,
          pickupCountry: reqPickupCountry,
          pickupCity: reqPickupCity,
          destinationCountry: reqDestCountry,
          destinationCity: reqDestCity,
          pickupDate: reqPickupDate,
          deliveryDeadline: reqDeliveryDeadline,
          vehicleRequirements: reqVehicleRequirements,
          offeredBudget: Number(reqBudget) || null,
          currency: reqCurrency,
          specialHandling: reqSpecialHandling,
        }),
      });
      if (!res.ok) throw new Error(res.error || "Failed to create transport request");
      setModalSuccessMsg("Transport Request Published Successfully!");
      setTimeout(() => {
        setShowTransportRequestModal(false);
        setModalSuccessMsg("");
        setReqCargoDesc("");
        setReqQty("");
        setReqBudget("");
        loadData();
      }, 1200);
    } catch (err) {
      alert(err.message || "Could not publish transport request");
    } finally {
      setModalSubmitting(false);
    }
  };

  // Toggle & Delete Helpers
  const handleToggleProductStatus = async (prodId, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "paused" : "active";
      await safeFetch(`/api/products/${prodId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      loadData();
    } catch (err) {
      alert("Failed to update product status");
    }
  };

  const handleDeleteProduct = async (prodId) => {
    if (!window.confirm("Are you sure you want to delete this product listing?")) return;
    try {
      await safeFetch(`/api/products/${prodId}`, { method: "DELETE" });
      loadData();
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  const handleToggleOfferStatus = async (offerId, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "paused" : "active";
      await safeFetch(`/api/products/offers/${offerId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      loadData();
    } catch (err) {
      alert("Failed to update offer status");
    }
  };

  const handleDeleteOffer = async (offerId) => {
    if (!window.confirm("Are you sure you want to remove this promotional offer?")) return;
    try {
      await safeFetch(`/api/products/offers/${offerId}`, { method: "DELETE" });
      loadData();
    } catch (err) {
      alert("Failed to delete promotional offer");
    }
  };

  const handleToggleDemandStatus = async (demandId, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "paused" : "active";
      await safeFetch(`/api/demands/${demandId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      loadData();
    } catch (err) {
      alert("Failed to update demand status");
    }
  };

  const handleDeleteDemand = async (demandId) => {
    if (!window.confirm("Are you sure you want to delete this buyer demand?")) return;
    try {
      await safeFetch(`/api/demands/${demandId}`, { method: "DELETE" });
      loadData();
    } catch (err) {
      alert("Failed to delete demand");
    }
  };

  const handleToggleTransportOfferStatus = async (offerId, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "withdrawn" : "active";
      await safeFetch(`/api/transport/${offerId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      loadData();
    } catch (err) {
      alert("Failed to update transport offer status");
    }
  };

  const handleDeleteTransportOffer = async (offerId) => {
    if (!window.confirm("Are you sure you want to delete this haulage offer?")) return;
    try {
      await safeFetch(`/api/transport/${offerId}`, { method: "DELETE" });
      loadData();
    } catch (err) {
      alert("Failed to delete transport offer");
    }
  };

  const handleToggleTransportRequestStatus = async (reqId, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "cancelled" : "active";
      await safeFetch(`/api/transport/requests/${reqId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      loadData();
    } catch (err) {
      alert("Failed to update transport request status");
    }
  };

  const handleDeleteTransportRequest = async (reqId) => {
    if (!window.confirm("Are you sure you want to delete this transport request?")) return;
    try {
      await safeFetch(`/api/transport/requests/${reqId}`, { method: "DELETE" });
      loadData();
    } catch (err) {
      alert("Failed to delete transport request");
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="space-y-6 animate-pulse">
          <div className="h-44 bg-slate-200/80 rounded-2xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-28 bg-slate-200/80 rounded-2xl" />
            <div className="h-28 bg-slate-200/80 rounded-2xl" />
            <div className="h-28 bg-slate-200/80 rounded-2xl" />
            <div className="h-28 bg-slate-200/80 rounded-2xl" />
          </div>
          <div className="h-96 bg-slate-200/80 rounded-2xl" />
        </div>
      </AppShell>
    );
  }

  const role = activeRole || user?.role || "exporter";
  const metrics = summary?.metrics || {};

  // Filter items by country if country filter is selected
  const filterByCountry = (list = [], getCountryFn) => {
    if (selectedCountry === "All") return list;
    return list.filter((item) => {
      const itemCountry = getCountryFn(item) || "";
      return itemCountry.toLowerCase().includes(selectedCountry.toLowerCase());
    });
  };

  const filteredDemands = filterByCountry(summary?.marketplaceDemands || [], (d) => d.destinationCountry);
  const filteredProducts = filterByCountry(summary?.marketplaceProducts || [], (p) => p.originCountry);
  const filteredTransport = filterByCountry(summary?.transportOffers || [], (t) => `${t.originCorridor} ${t.destinationCorridor}`);

  return (
    <AppShell>
      <div className="space-y-6 font-sans">
        {/* Verification Alert Banner if Not Verified */}
        {user?.verificationStatus !== "verified" && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-amber-950">
                  {user?.verificationStatus === "pending_review"
                    ? "Verification Under Review"
                    : "Complete Your Corridor Verification"}
                </h4>
                <p className="text-xs text-amber-800 mt-0.5">
                  {user?.verificationStatus === "pending_review"
                    ? "Your identity and compliance documents have been submitted and are being reviewed by authorized customs officers."
                    : "Upload your CNIC, trade enterprise license, or HTV driving documents in the Verification Center to unlock private deal rooms and verified trader shield."}
                </p>
              </div>
            </div>
            <Link
              to="/verification"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition shrink-0 flex items-center gap-1.5 self-start sm:self-center"
            >
              <span>{user?.verificationStatus === "pending_review" ? "View Status" : "Upload CNIC & Documents"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* 1. Hero Trade Banner with Role-Specific Heading and Status */}
        <div className="relative rounded-2xl overflow-hidden shadow-md text-white bg-[#0A1A2E]">
          <div className="absolute inset-0 z-0">
            <img
              src="/images/mountain-truck-highway.jpg"
              alt="Trade Corridor Transport"
              className="w-full h-full object-cover object-center brightness-75 contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#061424]/95 via-[#081a2e]/85 to-[#0b243e]/70" />
          </div>

          <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              {/* Role Indicator Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  Active Dashboard: <strong className="text-white uppercase font-extrabold">{role === "driver" ? "Transporter / Driver" : role}</strong> ({user?.fullName || "Muhammad Yasin"})
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {role === "exporter" && "Export Hub & Commodity Fulfillment"}
                {role === "importer" && "Import Procurement & Demand Center"}
                {role === "driver" && "Freight Logistics & Haulage Operations"}
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl font-normal">
                {role === "exporter" && "Publish export commodity offers, review live buyer demands from regional importers, and coordinate road transit to international borders."}
                {role === "importer" && "Publish purchase demands, browse active exporter commodity offers, hire cross-border hauliers, and negotiate deals securely."}
                {role === "driver" && "Advertise truck cargo capacity, pick up freight demands from importers and exporters, and negotiate road haulage rates."}
              </p>

              {/* Quick Action Buttons on Banner */}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                {role === "importer" && (
                  <button
                    onClick={() => setShowDemandModal(true)}
                    className="inline-flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-500/25 transition cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Post Purchase Demand (RFQ)
                  </button>
                )}

                {role === "exporter" && (
                  <button
                    onClick={() => setShowProductModal(true)}
                    className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/25 transition cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Publish Export Offer
                  </button>
                )}

                {role === "driver" && (
                  <button
                    onClick={() => setShowTransportModal(true)}
                    className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/25 transition cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Publish Haulage Offer
                  </button>
                )}

                <Link
                  to="/marketplace"
                  className="inline-flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700/80 text-white font-medium text-xs px-4 py-2.5 rounded-xl border border-slate-600 transition"
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  Full Marketplace
                </Link>
              </div>
            </div>

            {/* Real Trade Volume Card */}
            <div className="bg-[#0b1e32]/85 backdrop-blur-md border border-slate-700/60 rounded-2xl p-5 sm:p-6 lg:w-72 shrink-0 shadow-xl">
              <div className="text-[11px] font-medium text-slate-300">Total Trade Ledger</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
                $ {Number(metrics?.totalTradeValue || 0).toLocaleString()}
              </div>
              <div className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{metrics?.totalTradeValue ? "Active Ledger" : "Corridor Ready"}</span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-300">
                <span>Active Deals:</span>
                <span className="font-bold text-white">{metrics?.openDeals ?? summary?.myConversations?.length ?? 0}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-slate-300">
                <span>Shipments in Transit:</span>
                <span className="font-bold text-emerald-400">{metrics?.activeShipments ?? metrics?.activeTrips ?? 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. ROLE SWITCHER BAR: 1-Click Access to Importer, Exporter & Transporter Hubs */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-2 sm:p-2.5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => handleRoleTabSwitch("exporter")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                role === "exporter"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Exporter Hub</span>
            </button>
            <button
              onClick={() => handleRoleTabSwitch("importer")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                role === "importer"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Importer Hub</span>
            </button>
            <button
              onClick={() => handleRoleTabSwitch("driver")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                role === "driver"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Transporter Hub</span>
            </button>
          </div>

          {/* Dynamic Country Filter & Auto Currency Indicator */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1 shrink-0">
              <Globe className="w-3.5 h-3.5 text-blue-500" /> Country:
            </span>
            <div className="flex items-center gap-1">
              {[
                { code: "All", label: "All", flag: "🌐", curr: "USD ($)" },
                { code: "Pakistan", label: "Pakistan", flag: "🇵🇰", curr: "PKR (₨)" },
                { code: "Iran", label: "Iran", flag: "🇮🇷", curr: "IRR (﷼)" },
                { code: "Afghanistan", label: "Afghanistan", flag: "🇦🇫", curr: "AFN (؋)" },
                { code: "China", label: "China", flag: "🇨🇳", curr: "CNY (¥)" },
              ].map((c) => (
                <button
                  key={c.code}
                  onClick={() => setSelectedCountry(c.code)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 flex items-center gap-1 cursor-pointer ${
                    selectedCountry === c.code
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                  title={`Filter by ${c.label} (Currency: ${c.curr})`}
                >
                  <span>{c.flag}</span>
                  <span className="hidden md:inline">{c.label}</span>
                  {selectedCountry === c.code && c.code !== "All" && (
                    <span className="text-[10px] bg-white/20 text-white px-1 rounded ml-1">
                      {getCurrencyForCountry(c.code)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Key Dynamic Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/conversations"
            className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Handshake className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Deals</span>
            </div>
            <div className="mt-3">
              <div className="text-xs text-slate-500 font-medium">Active Deal Rooms</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">
                {summary?.myConversations?.length ?? 0}
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                Tripartite negotiations active
              </div>
            </div>
          </Link>

          <Link
            to="/shipments"
            className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Transit</span>
            </div>
            <div className="mt-3">
              <div className="text-xs text-slate-500 font-medium">Shipments & Trips</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">
                {metrics?.activeShipments ?? metrics?.activeTrips ?? 0}
              </div>
              <div className="text-[11px] text-blue-600 font-semibold mt-0.5">
                GPS cross-border tracking
              </div>
            </div>
          </Link>

          <Link
            to="/verification"
            className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition group"
          >
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                user?.verificationStatus === "verified"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-amber-50 text-amber-600"
              }`}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trust</span>
            </div>
            <div className="mt-3">
              <div className="text-xs text-slate-500 font-medium">Compliance Shield</div>
              <div className="text-base font-extrabold text-slate-900 mt-1 capitalize truncate">
                {user?.verificationStatus === "verified"
                  ? "Verified Trader"
                  : user?.verificationStatus === "pending_review"
                  ? "Under Review"
                  : "Upload Docs"}
              </div>
              <div className={`text-[11px] font-semibold mt-0.5 ${
                user?.verificationStatus === "verified" ? "text-emerald-600" : "text-amber-600"
              }`}>
                {user?.verificationStatus === "verified" ? "✓ Verified Badge Active" : "Upload CNIC & Docs →"}
              </div>
            </div>
          </Link>

          <Link
            to="/conversations"
            className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chat & Calls</span>
            </div>
            <div className="mt-3">
              <div className="text-xs text-slate-500 font-medium">Messages & WebRTC</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">
                {summary?.myConversations?.length ?? 0}
              </div>
              <div className="text-[11px] text-purple-600 font-semibold mt-0.5">
                Encrypted Audio & Video ready
              </div>
            </div>
          </Link>
        </div>

        {/* 4. MAIN ROLE-SPECIFIC WORKSPACES */}

        {/* ============================================================== */}
        {/* A. IMPORTER DASHBOARD VIEW                                      */}
        {/* ============================================================== */}
        {role === "importer" && (
          <div className="space-y-6">
            {/* Section 1: My Demands */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-emerald-600" />
                    <span>My Purchase Demands (Importer RFQs)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Your active procurement demands published to regional producers and exporters.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowDemandModal(true)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Post New Demand</span>
                  </button>
                  <Link
                    to="/demands"
                    className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                  >
                    Manage Demands
                  </Link>
                </div>
              </div>

              {summary?.myDemands && summary.myDemands.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {summary.myDemands.map((demand) => (
                    <div
                      key={demand._id || demand.id}
                      className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/20 hover:border-emerald-200 transition space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                          {demand.category || "Commodity"}
                        </span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600 text-white capitalize">
                          {demand.status || "active"}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">{demand.title}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2">{demand.specifications}</p>
                      <div className="pt-2 border-t border-emerald-100/60 flex items-center justify-between text-xs">
                        <span className="text-slate-500">
                          Qty: <strong>{demand.quantityRequired} {demand.unit}</strong>
                        </span>
                        <span className="font-bold text-emerald-800">
                          {demand.currency || "USD"} {demand.targetPrice ? Number(demand.targetPrice).toLocaleString() : "Negotiable"}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Destination: <strong>{demand.destinationCity}, {demand.destinationCountry}</strong>
                      </div>

                      {/* Demand Action Controls */}
                      <div className="pt-2 border-t border-emerald-100 flex items-center justify-between gap-1">
                        <button
                          type="button"
                          onClick={() => handleToggleDemandStatus(demand._id || demand.id, demand.status)}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition flex items-center gap-1 cursor-pointer"
                        >
                          {demand.status === "active" ? <Pause className="w-3 h-3 text-amber-600" /> : <Play className="w-3 h-3 text-emerald-600" />}
                          <span>{demand.status === "active" ? "Pause" : "Resume"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteDemand(demand._id || demand.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
                          title="Delete Demand"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-600 font-semibold">
                    You haven't posted any buyer demands yet.
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-md mx-auto">
                    Post what commodities you need to import so regional exporters can review your specs and submit quotes directly.
                  </p>
                  <button
                    onClick={() => setShowDemandModal(true)}
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Post Your First Demand</span>
                  </button>
                </div>
              )}
            </div>

            {/* Section 1B: Importer Cargo Transport Requests */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-purple-600" />
                    <span>My Cargo Transport Requests (Hire Hauliers for Inbound Shipments)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Transport requests you submitted to cross-border drivers and fleet operators.
                  </p>
                </div>
                <button
                  onClick={() => setShowTransportRequestModal(true)}
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Request Transportation</span>
                </button>
              </div>

              {summary?.myTransportRequests && summary.myTransportRequests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {summary.myTransportRequests.map((req) => (
                    <div
                      key={req._id || req.id}
                      className="p-4 rounded-xl border border-purple-100 bg-purple-50/20 hover:border-purple-200 transition space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded">
                          {req.cargoCategory || "Cargo"}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full capitalize ${
                            req.status === "active" ? "bg-purple-600 text-white" : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">{req.title}</h4>
                      <div className="text-xs text-slate-600">
                        Corridor: <strong>{req.pickupCity}, {req.pickupCountry}</strong> ➔ <strong>{req.destinationCity}, {req.destinationCountry}</strong>
                      </div>
                      <div className="pt-2 border-t border-purple-100/60 flex items-center justify-between text-xs">
                        <span className="text-slate-500">
                          Volume: <strong>{req.quantity} {req.unit}</strong>
                        </span>
                        <span className="font-bold text-purple-900">
                          Budget: {req.currency} {req.offeredBudget ? Number(req.offeredBudget).toLocaleString() : "Negotiable"}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-purple-100 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleToggleTransportRequestStatus(req._id || req.id, req.status)}
                          className="px-2 py-0.5 text-[11px] font-semibold rounded border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
                        >
                          {req.status === "active" ? "Cancel Request" : "Reactivate"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTransportRequest(req._id || req.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                          title="Delete Request"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                  You haven't requested any freight haulage yet. Click "Request Transportation" to hire drivers for your imported goods.
                </div>
              )}
            </div>

            {/* Section 2: Exporter Product Offers (Commodities Available in Corridor) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    <span>Exporter Product Offers (Corridor Marketplace)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Verified export commodities available from Pakistan, Iran, Afghanistan, and China producers.
                  </p>
                </div>
                <Link
                  to="/marketplace?tab=products"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 shrink-0"
                >
                  Browse All Products <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="space-y-3">
                  {filteredProducts.map((prod) => (
                    <div
                      key={prod._id || prod.id}
                      className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Package className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                              {prod.title}
                            </h4>
                            {prod.exporterId?.verificationStatus === "verified" && (
                              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Origin: <strong>{prod.originCity || "Trade Hub"}, {prod.originCountry || "Pakistan"}</strong> • Category: {prod.category || "General"}
                          </div>
                          <div className="text-[11px] text-slate-700 font-semibold mt-1">
                            Price: <strong className="text-emerald-700">{prod.currency || "USD"} {Number(prod.pricePerUnit || prod.price || 0).toLocaleString()}</strong> / {prod.unit || "unit"} • Qty: {prod.quantityAvailable || "Bulk"}
                          </div>
                          {prod.exporterId?.fullName && (
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              Supplier: {prod.exporterId.fullName} ({prod.exporterId.businessName || "Commercial Trading"})
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                        <Link
                          to={`/conversations?newDeal=product&id=${prod._id || prod.id}&title=${encodeURIComponent(prod.title)}&targetUserId=${prod.exporterId?._id || prod.exporterId?.id || (typeof prod.exporterId === "string" ? prod.exporterId : "")}`}
                          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Handshake className="w-3.5 h-3.5" />
                          <span>Negotiate & Buy</span>
                        </Link>
                        {prod.exporterId?.phone && (
                          <a
                            href={`https://wa.me/${prod.exporterId.phone.replace(/[^0-9]/g, "")}`}
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
              ) : (
                <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                  No export commodities matching this filter currently.
                </div>
              )}
            </div>

            {/* Section 3: Transporter Freight Offers */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-purple-600" />
                    <span>Transporter Freight Offers (Road Haulage)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Available trucks and road logistics capacity along international border corridors.
                  </p>
                </div>
                <Link
                  to="/transport"
                  className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 shrink-0"
                >
                  View All Transporters <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {filteredTransport.length > 0 ? (
                <div className="space-y-3">
                  {filteredTransport.map((offer) => (
                    <div
                      key={offer._id || offer.id}
                      className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                          <Truck className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                            {offer.title}
                          </h4>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Corridor: <strong>{offer.originCorridor}</strong> ➔ <strong>{offer.destinationCorridor}</strong>
                          </div>
                          <div className="text-[11px] text-slate-700 font-semibold mt-1">
                            Available Capacity: {offer.availableCapacityTons} Tons • Rate: <strong className="text-purple-700">{offer.currency || "USD"} {Number(offer.ratePerKmOrTrip).toLocaleString()}</strong> {offer.pricingUnit || "Per Trip"}
                          </div>
                          {offer.driverId?.fullName && (
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              Haulier: {offer.driverId.fullName} {offer.driverId.truckPlateNumber && `• Plate: ${offer.driverId.truckPlateNumber}`}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                        <Link
                          to={`/conversations?newDeal=transport&id=${offer._id || offer.id}&title=${encodeURIComponent(offer.title)}&targetUserId=${offer.driverId?._id || offer.driverId?.id || (typeof offer.driverId === "string" ? offer.driverId : "")}`}
                          className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Compass className="w-3.5 h-3.5" />
                          <span>Book Transport</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                  No transport listings matching this filter currently.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* B. EXPORTER DASHBOARD VIEW                                      */}
        {/* ============================================================== */}
        {role === "exporter" && (
          <div className="space-y-6">
            {/* Section 1: My Published Export Offers */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    <span>My Export Commodity Offers</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Commodities you have published for export to regional importers across Pakistan, Iran, and Afghanistan.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowProductModal(true)}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Publish Export Offer</span>
                  </button>
                  <Link
                    to="/products"
                    className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                  >
                    Manage Catalog
                  </Link>
                </div>
              </div>

              {summary?.myProducts && summary.myProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {summary.myProducts.map((prod) => (
                    <div
                      key={prod._id || prod.id}
                      className="p-4 rounded-xl border border-blue-100 bg-blue-50/20 hover:border-blue-200 transition space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                          {prod.category || "Commodity"}
                        </span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-600 text-white capitalize">
                          {prod.status || "active"}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">{prod.title}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2">{prod.description}</p>
                      <div className="pt-2 border-t border-blue-100/60 flex items-center justify-between text-xs">
                        <span className="text-slate-500">
                          Stock: <strong>{prod.quantityAvailable} {prod.unit}</strong>
                        </span>
                        <span className="font-bold text-blue-800">
                          {prod.currency || "USD"} {Number(prod.pricePerUnit).toLocaleString()} / {prod.unit}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Dispatch Origin: <strong>{prod.originCity}, {prod.originCountry}</strong>
                      </div>

                      {/* Product Action Controls */}
                      <div className="pt-2 border-t border-blue-100 flex items-center justify-between gap-1 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handleToggleProductStatus(prod._id || prod.id, prod.status)}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition flex items-center gap-1 cursor-pointer"
                        >
                          {prod.status === "active" ? <Pause className="w-3 h-3 text-amber-600" /> : <Play className="w-3 h-3 text-emerald-600" />}
                          <span>{prod.status === "active" ? "Pause" : "Resume"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setOfferProductId(prod._id || prod.id);
                            setOfferProductTitle(prod.title);
                            setShowOfferModal(true);
                          }}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition flex items-center gap-1 cursor-pointer"
                          title="Attach promotional discount to this product"
                        >
                          <Tag className="w-3 h-3 text-rose-600" />
                          <span>+ Promo Offer</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(prod._id || prod.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-600 font-semibold">
                    You haven't listed any export products yet.
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-md mx-auto">
                    Publish your agricultural, mineral, petroleum, or manufactured goods to receive orders from regional importers.
                  </p>
                  <button
                    onClick={() => setShowProductModal(true)}
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Publish Your First Offer</span>
                  </button>
                </div>
              )}
            </div>

            {/* Section 1B: My Promotional Offers & Special Prices */}
            {summary?.myProductOffers && summary.myProductOffers.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                      <Tag className="w-5 h-5 text-rose-600" />
                      <span>My Promotional Offers & Special Prices</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Promotional discounts and volume pricing attached to your export catalog.
                    </p>
                  </div>
                  <Link
                    to="/marketplace?tab=offers"
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 shrink-0"
                  >
                    View in Market <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {summary.myProductOffers.map((offer) => (
                    <div
                      key={offer._id || offer.id}
                      className="p-4 rounded-xl border border-rose-100 bg-rose-50/20 hover:border-rose-200 transition space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded">
                          {offer.discountValue}{offer.discountType === "percentage" ? "% OFF" : ` ${offer.currency} OFF`}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full capitalize ${
                            offer.status === "active" ? "bg-rose-600 text-white" : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {offer.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">
                        {offer.productId?.title || offer.title || "Special Export Offer"}
                      </h4>
                      <div className="pt-2 border-t border-rose-100/60 flex items-center justify-between text-xs">
                        <span className="text-slate-500 line-through">
                          {offer.currency} {Number(offer.originalPrice || 0).toLocaleString()}
                        </span>
                        <span className="font-extrabold text-rose-800 text-sm">
                          {offer.currency} {Number(offer.offerPrice || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center justify-between">
                        <span>Min Qty: <strong>{offer.minQuantity || 1} units</strong></span>
                        <span>Valid Until: <strong>{new Date(offer.validUntil).toLocaleDateString()}</strong></span>
                      </div>
                      <div className="pt-2 border-t border-rose-100 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleToggleOfferStatus(offer._id || offer.id, offer.status)}
                          className="px-2 py-0.5 text-[11px] font-semibold rounded border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
                        >
                          {offer.status === "active" ? "Pause Offer" : "Resume"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteOffer(offer._id || offer.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                          title="Delete Offer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 1C: Exporter Cargo Transport Requests */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-purple-600" />
                    <span>My Cargo Transport Requests (Move Goods to Border)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Haulage requirements you published for transport providers and fleet drivers.
                  </p>
                </div>
                <button
                  onClick={() => setShowTransportRequestModal(true)}
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Request Cargo Transport</span>
                </button>
              </div>

              {summary?.myTransportRequests && summary.myTransportRequests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {summary.myTransportRequests.map((req) => (
                    <div
                      key={req._id || req.id}
                      className="p-4 rounded-xl border border-purple-100 bg-purple-50/20 hover:border-purple-200 transition space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded">
                          {req.cargoCategory || "Cargo"}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full capitalize ${
                            req.status === "active" ? "bg-purple-600 text-white" : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">{req.title}</h4>
                      <div className="text-xs text-slate-600">
                        Corridor: <strong>{req.pickupCity}, {req.pickupCountry}</strong> ➔ <strong>{req.destinationCity}, {req.destinationCountry}</strong>
                      </div>
                      <div className="pt-2 border-t border-purple-100/60 flex items-center justify-between text-xs">
                        <span className="text-slate-500">
                          Volume: <strong>{req.quantity} {req.unit}</strong>
                        </span>
                        <span className="font-bold text-purple-900">
                          Budget: {req.currency} {req.offeredBudget ? Number(req.offeredBudget).toLocaleString() : "Negotiable"}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-purple-100 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleToggleTransportRequestStatus(req._id || req.id, req.status)}
                          className="px-2 py-0.5 text-[11px] font-semibold rounded border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
                        >
                          {req.status === "active" ? "Cancel Request" : "Reactivate"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTransportRequest(req._id || req.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                          title="Delete Request"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                  You haven't requested any freight haulage yet. Click "Request Cargo Transport" to hire drivers for your export goods.
                </div>
              )}
            </div>

            {/* Section 2: All Importers' Demands (RFQ Board) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-emerald-600" />
                    <span>All Regional Importers' Demands (Live Sourcing RFQs)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Buyer requests published by importers in Pakistan, Iran, and Afghanistan seeking supplies.
                  </p>
                </div>
                <Link
                  to="/marketplace?tab=demands"
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 shrink-0"
                >
                  View All Demands <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {filteredDemands.length > 0 ? (
                <div className="space-y-3">
                  {filteredDemands.map((demand) => (
                    <div
                      key={demand._id || demand.id}
                      className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <ShoppingBag className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                              {demand.title}
                            </h4>
                            {demand.buyerId?.verificationStatus === "verified" && (
                              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Buyer
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Destination: <strong>{demand.destinationCountry || "Pakistan"}</strong> ({demand.destinationCity || "Hub"}) • Category: {demand.category || "Commodity"}
                          </div>
                          <div className="text-[11px] text-slate-700 font-semibold mt-1">
                            Quantity: {demand.quantityRequired} {demand.unit}
                            {demand.targetPrice && ` • Target Budget: ${demand.currency || "USD"} ${Number(demand.targetPrice).toLocaleString()}`}
                          </div>
                          {demand.buyerId?.fullName && (
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              Buyer: {demand.buyerId.fullName} ({demand.buyerId.businessName || "Commercial Importer"})
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                        <Link
                          to={`/conversations?newDeal=demand&id=${demand._id || demand.id}&title=${encodeURIComponent(demand.title)}&targetUserId=${demand.buyerId?._id || demand.buyerId?.id || (typeof demand.buyerId === "string" ? demand.buyerId : "")}`}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Handshake className="w-3.5 h-3.5" />
                          <span>Make Offer / Supply</span>
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
              ) : (
                <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                  No buyer demands matching this filter currently.
                </div>
              )}
            </div>

            {/* Section 3: Available Transporters */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-purple-600" />
                    <span>Available Road Logistics & Trucks (Book Freight)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Hire verified hauliers to move your export commodities to cross-border zero points.
                  </p>
                </div>
                <Link
                  to="/transport"
                  className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 shrink-0"
                >
                  View All Transporters <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {filteredTransport.length > 0 ? (
                <div className="space-y-3">
                  {filteredTransport.slice(0, 4).map((offer) => (
                    <div
                      key={offer._id || offer.id}
                      className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                          <Truck className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                            {offer.title}
                          </h4>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Route: <strong>{offer.originCorridor}</strong> ➔ <strong>{offer.destinationCorridor}</strong>
                          </div>
                          <div className="text-[11px] text-slate-700 font-semibold mt-1">
                            Payload: {offer.availableCapacityTons} Tons • Rate: <strong className="text-purple-700">{offer.currency || "USD"} {Number(offer.ratePerKmOrTrip).toLocaleString()}</strong> {offer.pricingUnit || "Per Trip"}
                          </div>
                        </div>
                      </div>

                      <Link
                        to={`/conversations?newDeal=transport&id=${offer._id || offer.id}&title=${encodeURIComponent(offer.title)}&targetUserId=${offer.driverId?._id || offer.driverId?.id || (typeof offer.driverId === "string" ? offer.driverId : "")}`}
                        className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Hire Haulier</span>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                  No transport listings matching this filter currently.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* C. TRANSPORTER / DRIVER DASHBOARD VIEW                          */}
        {/* ============================================================== */}
        {role === "driver" && (
          <div className="space-y-6">
            {/* Section 1: My Published Haulage Offers */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-amber-600" />
                    <span>My Published Haulage Offers (Road Freight)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Your advertised routes and truck capacity available to corridor traders.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowTransportModal(true)}
                    className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Publish Haulage Offer</span>
                  </button>
                  <Link
                    to="/transport"
                    className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                  >
                    All Logistics
                  </Link>
                </div>
              </div>

              {summary?.myOffers && summary.myOffers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {summary.myOffers.map((offer) => (
                    <div
                      key={offer._id || offer.id}
                      className="p-4 rounded-xl border border-amber-100 bg-amber-50/20 hover:border-amber-200 transition space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">
                          {offer.cargoCategory || "General Freight"}
                        </span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-600 text-white capitalize">
                          {offer.status || "active"}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">{offer.title}</h4>
                      <div className="text-xs text-slate-600">
                        Route: <strong>{offer.originCorridor}</strong> ➔ <strong>{offer.destinationCorridor}</strong>
                      </div>
                      <div className="pt-2 border-t border-amber-100/60 flex items-center justify-between text-xs">
                        <span className="text-slate-500">
                          Capacity: <strong>{offer.availableCapacityTons} Tons</strong>
                        </span>
                        <span className="font-bold text-amber-900">
                          {offer.currency || "USD"} {Number(offer.ratePerKmOrTrip).toLocaleString()} {offer.pricingUnit || "Per Trip"}
                        </span>
                      </div>

                      {/* Transport Offer Actions */}
                      <div className="pt-2 border-t border-amber-100 flex items-center justify-between gap-1">
                        <button
                          type="button"
                          onClick={() => handleToggleTransportOfferStatus(offer._id || offer.id, offer.status)}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition flex items-center gap-1 cursor-pointer"
                        >
                          {offer.status === "active" ? <Pause className="w-3 h-3 text-amber-600" /> : <Play className="w-3 h-3 text-emerald-600" />}
                          <span>{offer.status === "active" ? "Withdraw" : "Reactivate"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTransportOffer(offer._id || offer.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
                          title="Delete Transport Offer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <Truck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-600 font-semibold">
                    You haven't published any road haulage offers yet.
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-md mx-auto">
                    Publish your truck routes and rates so exporters and importers can contract your fleet for cross-border transit.
                  </p>
                  <button
                    onClick={() => setShowTransportModal(true)}
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Publish Your First Haulage Offer</span>
                  </button>
                </div>
              )}
            </div>

            {/* Section 1B: Cargo Transport Requests (From Importers & Exporters) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-indigo-600" />
                    <span>Cargo Transport Requests (Live Jobs from Traders)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Direct haulage demands posted by regional importers and exporters seeking cross-border transport.
                  </p>
                </div>
                <Link
                  to="/marketplace?tab=requests"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 shrink-0"
                >
                  View All Requests <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {summary?.transportRequests && summary.transportRequests.length > 0 ? (
                <div className="space-y-3">
                  {summary.transportRequests.map((req) => (
                    <div
                      key={req._id || req.id}
                      className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <Truck className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                              {req.title}
                            </h4>
                            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                              {req.cargoCategory || "General Cargo"}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Route: <strong>{req.pickupCity}, {req.pickupCountry}</strong> ➔ <strong>{req.destinationCity}, {req.destinationCountry}</strong>
                          </div>
                          <div className="text-[11px] text-slate-700 font-semibold mt-1">
                            Cargo Payload: {req.quantity} {req.unit} • Offered Budget: <strong className="text-emerald-700">{req.currency || "USD"} {req.offeredBudget ? Number(req.offeredBudget).toLocaleString() : "Negotiable"}</strong>
                          </div>
                          {req.requesterId?.fullName && (
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              Shipper: {req.requesterId.fullName} ({req.requesterId.role?.toUpperCase() || "TRADER"})
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                        <Link
                          to={`/conversations?newDeal=transport_request&id=${req._id || req.id}&title=${encodeURIComponent(req.title)}&targetUserId=${req.requesterId?._id || req.requesterId?.id || (typeof req.requesterId === "string" ? req.requesterId : "")}`}
                          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Handshake className="w-3.5 h-3.5" />
                          <span>Submit Transport Quote</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                  No active cargo transport requests found currently.
                </div>
              )}
            </div>

            {/* Section 2: Market Cargo Demands (Importers & Exporters) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <Compass className="w-5 h-5 text-blue-600" />
                    <span>Marketplace Cargo Demands (Importers & Exporters Requiring Transit)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Commercial shipments and commodity demands requiring freight transportation.
                  </p>
                </div>
                <Link
                  to="/marketplace?tab=demands"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 shrink-0"
                >
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {filteredDemands.length > 0 ? (
                <div className="space-y-3">
                  {filteredDemands.map((demand) => (
                    <div
                      key={demand._id || demand.id}
                      className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                          <Truck className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                            {demand.title}
                          </h4>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Corridor Route: <strong>{demand.preferredOrigin || "Origin"}</strong> ➔ <strong>{demand.destinationCity}, {demand.destinationCountry}</strong>
                          </div>
                          <div className="text-[11px] text-slate-700 font-semibold mt-1">
                            Payload Required: {demand.quantityRequired} {demand.unit} • Budget: {demand.currency || "USD"} {demand.targetPrice ? Number(demand.targetPrice).toLocaleString() : "Negotiable"}
                          </div>
                          {demand.buyerId?.fullName && (
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              Shipper / Buyer: {demand.buyerId.fullName} ({demand.buyerId.country})
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                        <Link
                          to={`/conversations?newDeal=demand&id=${demand._id || demand.id}&title=${encodeURIComponent(demand.title)}&targetUserId=${demand.buyerId?._id || demand.buyerId?.id || (typeof demand.buyerId === "string" ? demand.buyerId : "")}`}
                          className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Compass className="w-3.5 h-3.5" />
                          <span>Offer Freight / Haulage</span>
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
              ) : (
                <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                  No cargo transit demands matching this filter currently.
                </div>
              )}
            </div>

            {/* Section 3: Marketplace Commodities Needing Haulage */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-emerald-600" />
                    <span>Exporter Commodities (Available for Transport Booking)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Agricultural and mineral products ready at producer warehouses needing transit to borders.
                  </p>
                </div>
                <Link
                  to="/marketplace?tab=products"
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 shrink-0"
                >
                  View Commodities <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="space-y-3">
                  {filteredProducts.slice(0, 4).map((prod) => (
                    <div
                      key={prod._id || prod.id}
                      className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <Package className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                            {prod.title}
                          </h4>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Pickup Hub: <strong>{prod.originCity}, {prod.originCountry}</strong>
                          </div>
                          <div className="text-[11px] text-slate-700 font-semibold mt-1">
                            Cargo Volume: {prod.quantityAvailable} {prod.unit} • Exporter: {prod.exporterId?.fullName || "Verified Producer"}
                          </div>
                        </div>
                      </div>

                      <Link
                        to={`/conversations?newDeal=product&id=${prod._id || prod.id}&title=${encodeURIComponent(prod.title)}&targetUserId=${prod.exporterId?._id || prod.exporterId?.id || (typeof prod.exporterId === "string" ? prod.exporterId : "")}`}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Offer Transit to Border</span>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                  No commodities matching this filter currently.
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. CALLS & COMMUNICATION DESK (Accessible across all roles) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Video className="w-5 h-5 text-emerald-600" />
                <span>My Secure Communications & Deal Rooms</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Tripartite deal rooms, peer-to-peer WebRTC voice/video calls, and chat history.
              </p>
            </div>
            <Link
              to="/conversations"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 shrink-0"
            >
              Open Inbox <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {summary?.myConversations && summary.myConversations.length > 0 ? (
            <div className="space-y-2.5">
              {summary.myConversations.map((conv) => (
                <Link
                  key={conv._id || conv.id}
                  to={`/conversations?id=${conv._id || conv.id}`}
                  className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                        {conv.title || "Commercial Deal Room"}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Status: <span className="text-emerald-600 font-semibold">{conv.status || "active"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="p-1.5 rounded-lg text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition">
                      <PhoneCall className="w-4 h-4" />
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <MessageSquare className="w-7 h-7 text-slate-300 mx-auto mb-1.5" />
              <p className="text-xs text-slate-600 font-medium">
                No active call or message threads yet.
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Select a counterparty from the Marketplace to negotiate rates, share documents, or start a call.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* QUICK MODALS WITH DYNAMIC COUNTRY -> CURRENCY & CITIES LINKING */}
      {/* ============================================================== */}

      {/* 1. Post Purchase Demand Modal (Importer RFQ) */}
      {showDemandModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-[#142B4A]">Post Purchase Demand (RFQ)</h3>
              <button
                onClick={() => setShowDemandModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {modalSuccessMsg ? (
              <div className="py-12 text-center text-emerald-600">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-emerald-500 animate-bounce" />
                <p className="font-bold text-sm">{modalSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleCreateDemand} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Demand Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sourcing 200 MT Super Kernel Basmati Rice"
                    value={demandTitle}
                    onChange={(e) => setDemandTitle(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <EditableSelect
                      label="Category *"
                      value={demandCategory}
                      onChange={setDemandCategory}
                      options={TRADE_CATEGORIES}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Quantity Required *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 200"
                      value={demandQty}
                      onChange={(e) => setDemandQty(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                {/* Country Selection: Auto-updates Currency & City */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <EditableSelect
                      label="Destination Country *"
                      value={demandCountry}
                      onChange={(val) => {
                        setDemandCountry(val);
                        setDemandCurrency(getCurrencyForCountry(val));
                        const available = getCitiesForCountry(val);
                        if (available.length > 0) {
                          setDemandCity(available[0].value);
                        }
                      }}
                      options={BORDER_COUNTRIES}
                    />
                  </div>

                  <div>
                    <EditableSelect
                      label="Destination City *"
                      value={demandCity}
                      onChange={setDemandCity}
                      options={getCitiesForCountry(demandCountry)}
                    />
                  </div>

                  <div>
                    <EditableSelect
                      label="Target Currency *"
                      value={demandCurrency}
                      onChange={setDemandCurrency}
                      options={CORRIDOR_CURRENCIES}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Target Budget Amount</label>
                    <input
                      type="number"
                      placeholder="e.g. 950"
                      value={demandPrice}
                      onChange={(e) => setDemandPrice(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <EditableSelect
                      label="Measurement Unit *"
                      value={demandUnit}
                      onChange={setDemandUnit}
                      options={TRADE_UNITS}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Specifications</label>
                  <textarea
                    rows={2}
                    placeholder="Moisture content, packing requirements, delivery timeline..."
                    value={demandSpecs}
                    onChange={(e) => setDemandSpecs(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowDemandModal(false)}
                    className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={modalSubmitting}
                    className="px-4 py-2 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs transition cursor-pointer"
                  >
                    {modalSubmitting ? "Publishing..." : "Publish Purchase Demand"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 2. Publish Export Offer Modal (Exporter Product) */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-[#142B4A]">Publish Export Commodity Offer</h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {modalSuccessMsg ? (
              <div className="py-12 text-center text-blue-600">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-blue-500 animate-bounce" />
                <p className="font-bold text-sm">{modalSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleCreateProduct} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Export Grade Red Onions, Bitumen 60/70"
                    value={productTitle}
                    onChange={(e) => setProductTitle(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <EditableSelect
                      label="Category *"
                      value={productCategory}
                      onChange={setProductCategory}
                      options={TRADE_CATEGORIES}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Quantity Available *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 50"
                      value={productQty}
                      onChange={(e) => setProductQty(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                {/* Country Selection: Auto-updates Currency & City */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <EditableSelect
                      label="Origin Country *"
                      value={productCountry}
                      onChange={(val) => {
                        setProductCountry(val);
                        setProductCurrency(getCurrencyForCountry(val));
                        const available = getCitiesForCountry(val);
                        if (available.length > 0) {
                          setProductCity(available[0].value);
                        }
                      }}
                      options={BORDER_COUNTRIES}
                    />
                  </div>

                  <div>
                    <EditableSelect
                      label="Origin City *"
                      value={productCity}
                      onChange={setProductCity}
                      options={getCitiesForCountry(productCountry)}
                    />
                  </div>

                  <div>
                    <EditableSelect
                      label="Settlement Currency *"
                      value={productCurrency}
                      onChange={setProductCurrency}
                      options={CORRIDOR_CURRENCIES}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Price per Unit *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 450"
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <EditableSelect
                      label="Measurement Unit *"
                      value={productUnit}
                      onChange={setProductUnit}
                      options={TRADE_UNITS}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Description & Quality Specs</label>
                  <textarea
                    rows={2}
                    placeholder="Phytosanitary treatment, loading parameters, maximum moisture..."
                    value={productDesc}
                    onChange={(e) => setProductDesc(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowProductModal(false)}
                    className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={modalSubmitting}
                    className="px-4 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs transition cursor-pointer"
                  >
                    {modalSubmitting ? "Publishing..." : "Publish Export Offer"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 3. Publish Haulage Offer Modal (Transporter Route) */}
      {showTransportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-[#142B4A]">Publish Road Haulage Offer</h3>
              <button
                onClick={() => setShowTransportModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {modalSuccessMsg ? (
              <div className="py-12 text-center text-amber-600">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-amber-500 animate-bounce" />
                <p className="font-bold text-sm">{modalSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleCreateTransport} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Offer Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Heavy Flatbed Truck: Quetta to Taftan Terminal"
                    value={transportTitle}
                    onChange={(e) => setTransportTitle(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <EditableSelect
                    label="Origin / Departure Corridor"
                    value={transportOrigin}
                    onChange={(val) => {
                      setTransportOrigin(val);
                      if (val.includes("Pakistan")) setTransportCurrency("PKR");
                      else if (val.includes("Iran")) setTransportCurrency("IRR");
                      else if (val.includes("Afghanistan")) setTransportCurrency("AFN");
                      else if (val.includes("China")) setTransportCurrency("CNY");
                    }}
                    options={[
                      "Quetta, Pakistan",
                      "Karachi Port, Pakistan",
                      "Gwadar Port, Pakistan",
                      "Lahore Dry Port, Pakistan",
                      "Peshawar, Pakistan",
                      "Taftan Border Terminal, Pakistan",
                      "Chaman Border Terminal, Pakistan",
                      "Zahedan, Iran",
                      "Mirjaveh Border, Iran",
                      "Kandahar, Afghanistan",
                      "Kabul, Afghanistan",
                      "Kashgar, China",
                    ]}
                    required
                  />
                  <EditableSelect
                    label="Destination / Border Post"
                    value={transportDestination}
                    onChange={setTransportDestination}
                    options={[
                      "Taftan / Mirjaveh Border",
                      "Chaman / Spin Boldak Border",
                      "Torkham / Jalalabad Border",
                      "Khunjerab / Tashkurgan Border",
                      "Rimdan / Gabd Border",
                      "Zahedan Terminal, Iran",
                      "Tehran Logistics Hub, Iran",
                      "Kandahar Logistics Hub, Afghanistan",
                      "Kashgar Free Trade Zone, China",
                    ]}
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Payload (Tons) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 40"
                      value={transportPayload}
                      onChange={(e) => setTransportPayload(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Rate *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 120000"
                      value={transportRate}
                      onChange={(e) => setTransportRate(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <EditableSelect
                      label="Currency *"
                      value={transportCurrency}
                      onChange={setTransportCurrency}
                      options={CORRIDOR_CURRENCIES}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cargo Type Permitted</label>
                  <input
                    type="text"
                    placeholder="Dry Bulk, Reefer / Perishables, Containers"
                    value={transportCargoType}
                    onChange={(e) => setTransportCargoType(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowTransportModal(false)}
                    className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={modalSubmitting}
                    className="px-4 py-2 text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-xs transition cursor-pointer"
                  >
                    {modalSubmitting ? "Publishing..." : "Publish Haulage Offer"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 4. Attach Promotional Offer Modal (Special Prices) */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-base text-[#142B4A]">
                  Create Promotional Offer
                </h3>
              </div>
              <button
                onClick={() => setShowOfferModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {modalSuccessMsg ? (
              <div className="py-12 text-center text-rose-600">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-rose-500 animate-bounce" />
                <p className="font-bold text-sm">{modalSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleCreateProductOffer} className="space-y-4 mt-4">
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-900">
                  Target Product: <strong>{offerProductTitle}</strong>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Discount Type *</label>
                    <select
                      value={offerDiscountType}
                      onChange={(e) => setOfferDiscountType(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      <option value="percentage">Percentage Discount (%)</option>
                      <option value="fixed">Fixed Price Reduction</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {offerDiscountType === "percentage" ? "Discount Percentage (%) *" : "Discount Amount *"}
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max={offerDiscountType === "percentage" ? "99" : void 0}
                      placeholder={offerDiscountType === "percentage" ? "e.g. 15" : "e.g. 50"}
                      value={offerDiscountValue}
                      onChange={(e) => setOfferDiscountValue(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Minimum Order Qty</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 10"
                      value={offerMinQuantity}
                      onChange={(e) => setOfferMinQuantity(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Validity (Days)</label>
                    <select
                      value={offerValidDays}
                      onChange={(e) => setOfferValidDays(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      <option value="7">7 Days</option>
                      <option value="14">14 Days</option>
                      <option value="30">30 Days</option>
                      <option value="60">60 Days</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Commercial Notes / Terms</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Special promotional corridor price for full trailer dispatch."
                    value={offerNotes}
                    onChange={(e) => setOfferNotes(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowOfferModal(false)}
                    className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={modalSubmitting}
                    className="px-4 py-2 text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs transition cursor-pointer"
                  >
                    {modalSubmitting ? "Publishing..." : "Publish Special Offer"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 5. Post Cargo Transport Request Modal (Independent Transport Request) */}
      {showTransportRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-base text-[#142B4A]">
                  Request Cargo Road Transport
                </h3>
              </div>
              <button
                onClick={() => setShowTransportRequestModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {modalSuccessMsg ? (
              <div className="py-12 text-center text-purple-600">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-purple-500 animate-bounce" />
                <p className="font-bold text-sm">{modalSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleCreateTransportRequest} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cargo Description *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 50 Tons Fresh Apples in Reefer Boxes"
                    value={reqCargoDesc}
                    onChange={(e) => setReqCargoDesc(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <EditableSelect
                      label="Cargo Category *"
                      value={reqCargoCategory}
                      onChange={setReqCargoCategory}
                      options={TRADE_CATEGORIES}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Quantity *</label>
                      <input
                        type="number"
                        required
                        placeholder="50"
                        value={reqQty}
                        onChange={(e) => setReqQty(e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                      />
                    </div>
                    <div>
                      <EditableSelect
                        label="Unit *"
                        value={reqUnit}
                        onChange={setReqUnit}
                        options={TRADE_UNITS}
                      />
                    </div>
                  </div>
                </div>

                {/* Pickup Origin */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <EditableSelect
                      label="Pickup Country *"
                      value={reqPickupCountry}
                      onChange={(val) => {
                        setReqPickupCountry(val);
                        const cities = getCitiesForCountry(val);
                        if (cities.length > 0) setReqPickupCity(cities[0].value);
                      }}
                      options={BORDER_COUNTRIES}
                    />
                  </div>
                  <div>
                    <EditableSelect
                      label="Pickup City / Hub *"
                      value={reqPickupCity}
                      onChange={setReqPickupCity}
                      options={getCitiesForCountry(reqPickupCountry)}
                    />
                  </div>
                </div>

                {/* Destination */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <EditableSelect
                      label="Destination Country *"
                      value={reqDestCountry}
                      onChange={(val) => {
                        setReqDestCountry(val);
                        const cities = getCitiesForCountry(val);
                        if (cities.length > 0) setReqDestCity(cities[0].value);
                      }}
                      options={BORDER_COUNTRIES}
                    />
                  </div>
                  <div>
                    <EditableSelect
                      label="Destination City / Terminal *"
                      value={reqDestCity}
                      onChange={setReqDestCity}
                      options={getCitiesForCountry(reqDestCountry)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Offered Budget</label>
                    <input
                      type="number"
                      placeholder="e.g. 2400"
                      value={reqBudget}
                      onChange={(e) => setReqBudget(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <EditableSelect
                      label="Currency *"
                      value={reqCurrency}
                      onChange={setReqCurrency}
                      options={CORRIDOR_CURRENCIES}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Vehicle Requirements</label>
                  <input
                    type="text"
                    placeholder="e.g. Reefer Truck, 40ft Flatbed, Tarpaulin Covered"
                    value={reqVehicleRequirements}
                    onChange={(e) => setReqVehicleRequirements(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowTransportRequestModal(false)}
                    className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={modalSubmitting}
                    className="px-4 py-2 text-xs font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-xs transition cursor-pointer"
                  >
                    {modalSubmitting ? "Publishing..." : "Submit Transport Request"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}
