import { Link, useNavigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { AppShell } from "../components/layout/AppShell.jsx";
import { StatusBadge } from "../components/ui/StatusBadge.jsx";
import {
  Package,
  PlusCircle,
  MapPin,
  CheckCircle2
} from "lucide-react";
import { EditableSelect } from "../components/ui/EditableSelect.jsx";
import {
  CORRIDOR_CURRENCIES,
  BORDER_COUNTRIES,
  CORRIDOR_CITIES,
  TRADE_CATEGORIES,
  TRADE_UNITS
} from "../lib/constants.js";
import { safeFetch } from "../lib/api.js";
export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [qualityGrade, setQualityGrade] = useState("");
  const [quantityAvailable, setQuantityAvailable] = useState("");
  const [unit, setUnit] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [currency, setCurrency] = useState("");
  const [originCountry, setOriginCountry] = useState("");
  const [originCity, setOriginCity] = useState("");
  const [destinationMarkets, setDestinationMarkets] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const loadMyProducts = async () => {
    try {
      const res = await safeFetch("/api/products?myOnly=true");
      if (res.ok) {
        setProducts(res.data?.products || []);
      } else {
        console.warn("Products load notice:", res.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadMyProducts();
    if (typeof window !== "undefined" && window.location.search.includes("action=new")) {
      setShowModal(true);
    }
  }, []);
  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await safeFetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          description,
          qualityGrade,
          quantityAvailable,
          unit,
          pricePerUnit,
          currency,
          originCountry,
          originCity,
          destinationMarkets,
          imageUrl: imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
        })
      });
      if (res.ok) {
        setFormSuccess(true);
        setTimeout(() => {
          setShowModal(false);
          setFormSuccess(false);
          loadMyProducts();
        }, 800);
      } else {
        alert(res.error || "Failed to create product");
      }
    } catch (err) {
      alert(err.message);
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
            <h1 className="text-xl font-bold text-[#142B4A]">
              My Export Products Catalog
            </h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              Manage your agricultural and industrial export inventory published across border corridors.
            </p>
          </div>

          <button
    onClick={() => setShowModal(true)}
    className="inline-flex items-center gap-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-medium text-xs px-3.5 py-2 rounded-lg shadow-xs transition"
  >
            <PlusCircle className="w-4 h-4" />
            Add New Product
          </button>
        </div>

        {
    /* Product Cards Grid */
  }
        {loading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-56 bg-white rounded-xl border border-slate-200 animate-pulse" />)}
          </div> : products.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p) => <div
    key={p.id}
    className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden flex flex-col"
  >
                <div className="h-36 bg-slate-100 relative">
                  <img
    src={p.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"}
    alt={p.title}
    className="w-full h-full object-cover"
  />
                  <div className="absolute top-2.5 right-2.5">
                    <StatusBadge status={p.status} size="sm" />
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-1">
                      {p.category} • {p.qualityGrade}
                    </div>
                    <h3 className="font-bold text-sm text-[#142B4A]">{p.title}</h3>
                    <p className="text-xs text-[#64748B] mt-1 line-clamp-2">{p.description}</p>

                    <div className="mt-3 py-2 border-t border-b border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Available:</span>
                      <span className="font-semibold text-slate-800">{p.quantityAvailable} {p.unit}</span>
                    </div>

                    <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>Origin: {p.originCity}, {p.originCountry}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-[#142B4A]">${p.pricePerUnit}</span>
                      <span className="text-[11px] text-slate-500"> / {p.unit}</span>
                    </div>
                    <Link
    to={`/marketplace`}
    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
  >
                      View on Market →
                    </Link>
                  </div>
                </div>
              </div>)}
          </div> : <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-base text-[#142B4A]">No products published yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Add your first export consignment to start receiving quotation requests and inquiries from verified importers.
            </p>
            <button
    onClick={() => setShowModal(true)}
    className="mt-4 inline-flex items-center gap-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-medium text-xs px-4 py-2 rounded-lg transition"
  >
              <PlusCircle className="w-4 h-4" />
              Add Your First Product
            </button>
          </div>}

        {
    /* Add Product Modal */
  }
        {showModal && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-base text-[#142B4A]">Publish Product for Export</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
              </div>

              {formSuccess ? <div className="py-12 text-center text-emerald-600">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-emerald-500" />
                  <p className="font-bold text-sm">Product Published Successfully!</p>
                </div> : <form onSubmit={handleCreate} className="space-y-4 mt-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Product Title *</label>
                    <input
    type="text"
    required
    placeholder="e.g. Fresh Red Onions Grade A, Bitumen 60/70"
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
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Quality / Grade</label>
                      <input
    type="text"
    placeholder="e.g. Export Grade A, Premium"
    value={qualityGrade}
    onChange={(e) => setQualityGrade(e.target.value)}
    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
  />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Description & Specs *</label>
                    <textarea
    rows={3}
    required
    placeholder="Specify packaging, moisture content, phytosanitary treatment, and loading parameters..."
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
  />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Quantity Available *</label>
                      <input
    type="number"
    required
    placeholder="e.g. 50"
    value={quantityAvailable}
    onChange={(e) => setQuantityAvailable(e.target.value)}
    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
  />
                    </div>

                    <div>
                      <EditableSelect
    label="Measurement Unit *"
    value={unit}
    onChange={setUnit}
    options={TRADE_UNITS}
  />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Price per Unit *</label>
                      <input
    type="number"
    required
    placeholder="e.g. 620"
    value={pricePerUnit}
    onChange={(e) => setPricePerUnit(e.target.value)}
    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
  />
                    </div>
                  </div>

                  {
    /* Currency Selection: PKR, IRR, AFN, CNY, USD */
  }
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <EditableSelect
    label="Settlement Currency *"
    value={currency}
    onChange={setCurrency}
    options={CORRIDOR_CURRENCIES}
  />
                    </div>

                    <div>
                      <EditableSelect
    label="Origin Country *"
    value={originCountry}
    onChange={setOriginCountry}
    options={BORDER_COUNTRIES}
  />
                    </div>

                    <div>
                      <EditableSelect
    label="Origin City / Hub *"
    value={originCity}
    onChange={setOriginCity}
    options={CORRIDOR_CITIES}
  />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Image URL (Optional)</label>
                    <input
    type="url"
    placeholder="https://..."
    value={imageUrl}
    onChange={(e) => setImageUrl(e.target.value)}
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
                      {submitting ? "Publishing..." : "Publish to Marketplace"}
                    </button>
                  </div>
                </form>}
            </div>
          </div>}
      </div>
    </AppShell>;
}
