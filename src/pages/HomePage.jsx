import { Link, useNavigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";


import {
  Globe2,
  ShieldCheck,
  Package,
  ShoppingBag,
  Truck,
  ArrowRight,
  MessageSquare,
  Lock,
  CheckCircle2,
  MapPin,
  Smartphone,
  X,
  Building2,
  Video,
  FileCheck,
  Menu,
  MessageCircle,
  Mail,
  Headphones
} from "lucide-react";
import { safeFetch } from "../lib/api.js";
export default function LandingPage() {
  const navigate = useNavigate(); const location = useLocation();
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showGetAppModal, setShowGetAppModal] = useState(false);
  const [showMemberOnlyModal, setShowMemberOnlyModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [liveOpportunities, setLiveOpportunities] = useState([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [inquiryForm, setInquiryForm] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    cityOrAddress: "",
    subject: "",
    message: "",
  });
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquiryFeedback, setInquiryFeedback] = useState(null);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setInquiryFeedback(null);

    if (!inquiryForm.fullName.trim() || inquiryForm.fullName.trim().length < 2) {
      setInquiryFeedback({ type: "error", message: "Please provide your Full Name (minimum 2 characters)." });
      return;
    }
    if (!inquiryForm.phoneNumber.trim() || inquiryForm.phoneNumber.trim().length < 7) {
      setInquiryFeedback({ type: "error", message: "Please provide a valid Phone Number (minimum 7 digits)." });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!inquiryForm.email.trim() || !emailRegex.test(inquiryForm.email.trim())) {
      setInquiryFeedback({ type: "error", message: "Please provide a valid Email Address." });
      return;
    }
    if (!inquiryForm.cityOrAddress.trim()) {
      setInquiryFeedback({ type: "error", message: "Please enter your Address or City." });
      return;
    }
    if (!inquiryForm.subject.trim() || inquiryForm.subject.trim().length < 3) {
      setInquiryFeedback({ type: "error", message: "Please enter an Inquiry Subject." });
      return;
    }
    if (!inquiryForm.message.trim() || inquiryForm.message.trim().length < 5) {
      setInquiryFeedback({ type: "error", message: "Please provide an Inquiry Message (minimum 5 characters)." });
      return;
    }

    setInquirySubmitting(true);
    try {
      const res = await safeFetch("/api/contact/inquiry", {
        method: "POST",
        body: JSON.stringify(inquiryForm),
      });

      if (res.ok && res.data?.success) {
        setInquiryFeedback({
          type: "success",
          message: res.data.message || "Inquiry sent successfully to our WhatsApp support coordinator!",
        });
        setInquiryForm({
          fullName: "",
          phoneNumber: "",
          email: "",
          cityOrAddress: "",
          subject: "",
          message: "",
        });
      } else {
        setInquiryFeedback({
          type: "error",
          message: res.data?.error || res.error || "Failed to deliver inquiry. Please verify your entries.",
        });
      }
    } catch (err) {
      setInquiryFeedback({
        type: "error",
        message: "Network error sending inquiry. Please try again or reach us directly on WhatsApp.",
      });
    } finally {
      setInquirySubmitting(false);
    }
  };
  useEffect(() => {
    async function loadData() {
      try {
        const userRes = await safeFetch("/api/auth/me").catch(() => null);
        if (userRes?.ok && userRes.data?.user) {
          setCurrentUser(userRes.data.user);
        }
        const prodRes = await safeFetch("/api/products").catch(() => null);
        const prods = prodRes?.ok ? (prodRes.data?.products || (Array.isArray(prodRes.data) ? prodRes.data : [])) : [];
        const items = prods.map((p) => ({
          id: p.id,
          title: p.title || "Listed Trade Product",
          type: "For Export",
          typeColor: "bg-emerald-50 text-emerald-800 border-emerald-300 font-bold",
          origin: p.originCountry || "Pakistan",
          destination: p.destinationMarkets || "Iran, Afghanistan",
          quantity: `${p.quantityAvailable || "100"} ${p.unit || "MT"}`,
          price: `$${p.pricePerUnit || "650"} / ${p.unit || "MT"}`,
          seller: p.originCity ? `${p.originCity} Merchant` : "Verified Exporter",
          sellerRole: "Exporter",
          imageUrl: p.imageUrl || "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
          link: `/marketplace?tab=products&search=${encodeURIComponent(p.title || "")}`
        }));
        setLiveOpportunities(items);
      } catch (err) {
        console.error("Failed to load trade opportunities:", err);
      } finally {
        setLoadingOpportunities(false);
      }
    }
    loadData();
  }, []);
  const handleOpportunityClick = (link) => {
    const validRoles = ["exporter", "importer", "driver", "transporter", "admin"];
    const userRole = (currentUser?.role || "").toLowerCase();
    if (!currentUser || !validRoles.includes(userRole)) {
      setShowMemberOnlyModal(true);
    } else {
      navigate(link);
    }
  };
  return <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans flex flex-col selection:bg-emerald-500 selection:text-white">
      {
    /* 1. Header / Navbar matching UI Reference */
  }
      <header className="sticky top-0 z-50 bg-[#091524] border-b border-[#132338]/80 text-white shadow-md backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {
    /* Logo */
  }
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition transform">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-white leading-none flex items-center gap-1.5">
                Border Export <span className="text-emerald-400">Hub</span>
              </span>
              <span className="text-[10px] tracking-wide text-slate-300 font-medium mt-0.5">
                Global Trade. Brighter Together.
              </span>
            </div>
          </Link>

          {
    /* Desktop Navigation */
  }
          <nav className="hidden lg:flex items-center gap-8 text-[13px] font-semibold text-slate-300">
            <Link to="/" className="text-white border-b-2 border-emerald-400 pb-1 font-bold">
              Home
            </Link>
            <Link to="/marketplace" className="hover:text-emerald-300 transition">
              Marketplace
            </Link>
            <a href="#how-it-works" className="hover:text-emerald-300 transition">
              How It Works
            </a>
            <a href="#about-us" className="hover:text-emerald-300 transition">
              About Us
            </a>
            <a href="#contact" className="hover:text-emerald-300 transition">
              Contact
            </a>
          </nav>

          {
    /* Right Header Actions */
  }
          <div className="hidden sm:flex items-center gap-3">
            {
    /* Language Locked to English (Per user request) */
  }
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 bg-[#102238]">
              <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>EN (English)</span>
            </div>

            {
    /* Direct Support Shortcut */
  }
            <a
    href="https://wa.me/923324042186"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:text-white px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/40 transition"
    title="WhatsApp: 03324042186"
  >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Support</span>
            </a>

            <Link
    to="/login"
    className="text-xs font-bold text-white hover:text-slate-200 px-4 py-2 rounded-lg border border-slate-700 bg-[#102238] hover:bg-slate-800 transition"
  >
              Login
            </Link>
            <Link
    to="/register"
    className="text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 px-5 py-2 rounded-lg shadow-md shadow-emerald-500/25 transition transform hover:-translate-y-0.5"
  >
              Get Started
            </Link>
          </div>

          {
    /* Mobile Menu Hamburger */
  }
          <div className="lg:hidden flex items-center gap-2">
            <Link
    to="/login"
    className="text-xs font-medium text-slate-200 px-3 py-1.5 rounded-md bg-slate-800 border border-slate-700"
  >
              Login
            </Link>
            <button
    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    className="p-2 rounded-lg bg-slate-800 text-slate-200 hover:text-white focus:outline-none"
    aria-label="Toggle navigation"
  >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {
    /* Mobile Nav Drawer */
  }
        {mobileMenuOpen && <div className="lg:hidden bg-[#0c1a2d] border-b border-slate-800 px-4 pt-3 pb-5 space-y-3">
            <Link
    to="/"
    onClick={() => setMobileMenuOpen(false)}
    className="block text-sm font-semibold text-emerald-400 py-1"
  >
              Home
            </Link>
            <Link
    to="/marketplace"
    onClick={() => setMobileMenuOpen(false)}
    className="block text-sm font-semibold text-slate-200 hover:text-emerald-300 py-1"
  >
              Marketplace
            </Link>
            <a
    href="#how-it-works"
    onClick={() => setMobileMenuOpen(false)}
    className="block text-sm font-semibold text-slate-200 hover:text-emerald-300 py-1"
  >
              How It Works
            </a>
            <a
    href="#about-us"
    onClick={() => setMobileMenuOpen(false)}
    className="block text-sm font-semibold text-slate-200 hover:text-emerald-300 py-1"
  >
              About Us
            </a>
            <a
    href="#contact"
    onClick={() => setMobileMenuOpen(false)}
    className="block text-sm font-semibold text-slate-200 hover:text-emerald-300 py-1"
  >
              Contact
            </a>
            <div className="pt-2 flex flex-col gap-2">
              <a
    href="https://wa.me/923324042186"
    target="_blank"
    rel="noopener noreferrer"
    className="w-full text-center text-xs font-bold py-2 rounded-lg bg-emerald-950 border border-emerald-500/50 text-emerald-300 flex items-center justify-center gap-1.5"
  >
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Support: 03324042186
              </a>
              <div className="flex gap-2">
                <Link
    to="/login"
    className="w-1/2 text-center text-xs font-semibold py-2.5 rounded-lg border border-slate-700 bg-slate-800 text-white"
  >
                  Login
                </Link>
                <Link
    to="/register"
    className="w-1/2 text-center text-xs font-bold py-2.5 rounded-lg bg-emerald-400 text-slate-950 shadow"
  >
                  Get Started
                </Link>
              </div>
            </div>
          </div>}
      </header>

      {
    /* 2. Hero Section with Highly Visible High-Contrast Action Buttons */
  }
      <section className="relative bg-[#071324] text-white py-16 sm:py-24 lg:py-28 overflow-hidden">
        {
    /* Background Port Visual with Dark Navy Overlay */
  }
        <div className="absolute inset-0 z-0">
          <img
    src="/images/hero-shipping-port.jpg"
    alt="International Logistics Port & Freight Hub"
    className="w-full h-full object-cover object-center brightness-60 contrast-110"
  />
          <div className="absolute inset-0 bg-gradient-to-r from-[#061222]/95 via-[#08172c]/85 to-[#0b1c34]/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {
    /* Left Hero Content */
  }
            <div className="lg:col-span-7">
              <div className="inline-block text-[11px] font-extrabold tracking-widest uppercase text-emerald-400 mb-4 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/25">
                THE SMARTER WAY TO TRADE
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Connect. Trade. Grow. <br />
                <span className="text-white">Across Borders.</span>
              </h1>

              <p className="mt-6 text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed font-normal">
                Border Export Hub is a secure B2B platform that connects exporters, importers, transporters and drivers across <span className="text-white font-semibold">Pakistan, Iran and Afghanistan</span> — making global trade simpler, safer and faster.
              </p>

              {
    /* Functional CTA Buttons - VIBRANT, HIGH-CONTRAST & CLEARLY VISIBLE (Fixed as requested) */
  }
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {
    /* 1. Join Now: Glowing Emerald Button */
  }
                <Link
    to="/register"
    className="inline-flex items-center gap-2 bg-[#00D084] hover:bg-[#00b975] text-[#071527] font-extrabold text-sm sm:text-base px-7 py-3.5 rounded-xl shadow-xl shadow-emerald-500/30 transition transform hover:-translate-y-0.5"
  >
                  Join Now
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {
    /* 2. Explore Marketplace: Crisp Solid White Button (High Contrast & Immediately Visible) */
  }
                <Link
    to="/marketplace"
    className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-[#071527] font-extrabold text-sm sm:text-base px-7 py-3.5 rounded-xl shadow-xl border-2 border-white transition transform hover:-translate-y-0.5"
  >
                  <ShoppingBag className="w-4 h-4 text-emerald-600" />
                  Explore Marketplace
                </Link>

                {
    /* 3. Get Mobile App: Vibrant Glowing Border Pill Button (High Contrast & Clear) */
  }
                <button
    onClick={() => setShowGetAppModal(true)}
    className="inline-flex items-center gap-2 bg-[#0d2a45] hover:bg-[#13385c] text-white hover:text-emerald-300 font-extrabold text-sm sm:text-base px-6 py-3.5 rounded-xl border-2 border-emerald-400 shadow-xl transition cursor-pointer"
  >
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  Get Mobile App
                </button>
              </div>
            </div>

            {
    /* Right Hero Trust Panel (Glassmorphism dark card matching UI reference) */
  }
            <div className="lg:col-span-5">
              <div className="bg-[#0b1c31]/80 backdrop-blur-md border border-slate-700/60 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5">
                {
    /* Item 1: Verified Businesses */
  }
                <div className="flex items-start gap-4 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Verified Businesses</h4>
                    <p className="text-xs text-slate-300 mt-0.5">Trusted and verified trade partners</p>
                  </div>
                </div>

                {
    /* Item 2: Secure Transactions */
  }
                <div className="flex items-start gap-4 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="w-11 h-11 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/30">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Secure Transactions</h4>
                    <p className="text-xs text-slate-300 mt-0.5">Protected data & secure communication</p>
                  </div>
                </div>

                {
    /* Item 3: Cross-Border Trade */
  }
                <div className="flex items-start gap-4 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                    <Globe2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Cross-Border Trade</h4>
                    <p className="text-xs text-slate-300 mt-0.5">Pakistan • Iran • Afghanistan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {
    /* 3. Five Feature Cards Section */
  }
      <section className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {
    /* Feature 1: Trade Marketplace */
  }
            <div
    onClick={() => handleOpportunityClick("/marketplace")}
    className="group p-5 rounded-2xl bg-slate-50/70 hover:bg-emerald-50/40 border border-slate-200/80 hover:border-emerald-300 transition text-center flex flex-col items-center shadow-xs cursor-pointer"
  >
              <div className="w-14 h-14 rounded-full bg-emerald-100/60 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-[#0F172A] group-hover:text-emerald-700 transition">
                Trade Marketplace
              </h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Find products, demands and verified business partners.
              </p>
            </div>

            {
    /* Feature 2: Logistics & Transport */
  }
            <div
    onClick={() => handleOpportunityClick("/transport")}
    className="group p-5 rounded-2xl bg-slate-50/70 hover:bg-emerald-50/40 border border-slate-200/80 hover:border-emerald-300 transition text-center flex flex-col items-center shadow-xs cursor-pointer"
  >
              <div className="w-14 h-14 rounded-full bg-teal-100/60 text-teal-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-[#0F172A] group-hover:text-teal-700 transition">
                Logistics & Transport
              </h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Connect with trusted transporters and drivers across borders.
              </p>
            </div>

            {
    /* Feature 3: Secure Messaging */
  }
            <div
    onClick={() => handleOpportunityClick("/conversations")}
    className="group p-5 rounded-2xl bg-slate-50/70 hover:bg-emerald-50/40 border border-slate-200/80 hover:border-emerald-300 transition text-center flex flex-col items-center shadow-xs cursor-pointer"
  >
              <div className="w-14 h-14 rounded-full bg-emerald-100/60 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-[#0F172A] group-hover:text-emerald-700 transition">
                Secure Messaging
              </h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Private deal rooms and real-time communication.
              </p>
            </div>

            {
    /* Feature 4: Document Management */
  }
            <div
    onClick={() => handleOpportunityClick("/documents")}
    className="group p-5 rounded-2xl bg-slate-50/70 hover:bg-emerald-50/40 border border-slate-200/80 hover:border-emerald-300 transition text-center flex flex-col items-center shadow-xs cursor-pointer"
  >
              <div className="w-14 h-14 rounded-full bg-teal-100/60 text-teal-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <FileCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-[#0F172A] group-hover:text-teal-700 transition">
                Document Management
              </h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Upload, share and verify trade documents securely.
              </p>
            </div>

            {
    /* Feature 5: Voice & Video Calls */
  }
            <div
    onClick={() => handleOpportunityClick("/conversations?view=calls")}
    className="group p-5 rounded-2xl bg-slate-50/70 hover:bg-emerald-50/40 border border-slate-200/80 hover:border-emerald-300 transition text-center flex flex-col items-center shadow-xs col-span-2 sm:col-span-1 cursor-pointer"
  >
              <div className="w-14 h-14 rounded-full bg-emerald-100/60 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <Video className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-[#0F172A] group-hover:text-emerald-700 transition">
                Voice & Video Calls
              </h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Stay connected with your partners, anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {
    /* 4. Latest Trade Opportunities (Showing ONLY listed products & Member-Gate Protected) */
  }
      <section className="py-16 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {
    /* Section Header */
  }
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                FEATURED ON MARKETPLACE
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1">
                Latest Trade Opportunities
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                Only verified listed products from active corridor members are displayed. Full trade details and direct deal negotiations require member registration.
              </p>
            </div>
            <Link
    to="/marketplace"
    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 group shrink-0"
  >
              View All Listings
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {
    /* Listed Product Cards or Clean Empty State */
  }
            <div className="lg:col-span-8">
              {liveOpportunities.length > 0 ? <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {liveOpportunities.map((item, index) => <div
    key={`product-card-${item.id}-${index}`}
    onClick={() => handleOpportunityClick(item.link)}
    className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between overflow-hidden group cursor-pointer"
  >
                      {
    /* Card Image */
  }
                      <div className="h-40 w-full overflow-hidden relative bg-slate-100">
                        <img
    src={item.imageUrl}
    alt={item.title}
    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
  />
                        <div className="absolute top-3 left-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${item.typeColor}`}>
                            {item.type}
                          </span>
                        </div>
                      </div>

                      {
    /* Card Content */
  }
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-[#0F172A] line-clamp-1 group-hover:text-emerald-700 transition">
                            {item.title}
                          </h4>

                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{item.origin} → {item.destination}</span>
                          </div>

                          <div className="flex items-center justify-between text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100">
                            <span className="font-medium">{item.quantity}</span>
                            <span className="font-extrabold text-[#0F172A] text-sm">{item.price}</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                              {item.seller.charAt(0)}
                            </div>
                            <div className="text-[11px] leading-tight">
                              <div className="font-semibold text-slate-900">{item.seller}</div>
                              <div className="text-slate-400">{item.sellerRole}</div>
                            </div>
                          </div>

                          {
    /* Member-Gated Details Action */
  }
                          <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      handleOpportunityClick(item.link);
    }}
    className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-3.5 py-1.5 rounded-lg transition cursor-pointer shadow-xs"
  >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>)}
                </div> : <div className="p-10 bg-white rounded-2xl border-2 border-dashed border-slate-200 text-center flex flex-col items-center justify-center min-h-[320px]">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                    <Package className="w-7 h-7" />
                  </div>
                  <h3 className="font-extrabold text-base text-[#0F172A]">No Trade Listings Yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
                    Live products from verified exporters and importers will appear here as trade listings are published.
                  </p>
                  <button
    onClick={() => handleOpportunityClick("/marketplace?tab=products")}
    className="mt-4 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-xs transition"
  >
                    List Products as Member
                  </button>
                </div>}
            </div>

            {
    /* Right Trust Panel: "Why Border Export Hub?" */
  }
            <div className="lg:col-span-4 bg-gradient-to-br from-[#0c2e35] via-[#09222c] to-[#061822] text-white rounded-2xl p-6 sm:p-7 border border-teal-800/40 shadow-lg flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                  WHY BORDER EXPORT HUB?
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1 leading-snug">
                  Your Trusted Partner in International Trade
                </h3>

                <ul className="mt-6 space-y-3.5 text-xs text-slate-200">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Verified and legitimate businesses</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Secure and encrypted communication</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>End-to-end trade support</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Built for cross-border trade</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Reliable and transparent platform</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-teal-800/60">
                <button
    onClick={() => setShowVerificationModal(true)}
    className="w-full inline-flex items-center justify-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs py-3 px-4 rounded-xl shadow-md transition cursor-pointer"
  >
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {
    /* 5. How It Works Section */
  }
      <section id="how-it-works" className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
              CORRIDOR WORKFLOW
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1">
              How Cross-Border Trade Operates on Border Export Hub
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              From inquiry to customs transit clearance across Pakistan, Iran, and Afghanistan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="text-emerald-600 font-extrabold text-2xl mb-2">01</div>
              <h4 className="font-bold text-sm text-[#0F172A]">Discovery & Matching</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Exporters list commodities; wholesale buyers post procurement demands with target quantities and border checkpoints.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="text-emerald-600 font-extrabold text-2xl mb-2">02</div>
              <h4 className="font-bold text-sm text-[#0F172A]">Private Deal Rooms</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Participants negotiate in isolated deal rooms with proforma invoices, voice notes, and real-time WebRTC audio/video calls.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="text-emerald-600 font-extrabold text-2xl mb-2">03</div>
              <h4 className="font-bold text-sm text-[#0F172A]">Transit Haulage Booking</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Shippers book registered corridor trucks, assign vehicle plates, and attach bilateral road transit documentation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="text-emerald-600 font-extrabold text-2xl mb-2">04</div>
              <h4 className="font-bold text-sm text-[#0F172A]">Border Release & Completion</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Consignments clear at Taftan, Chaman, or Rimdan customs gates with verified waybill receipts and deal completion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {
    /* 6. Regional Infrastructure: CRISP, HIGH-CONTRAST & CLEARLY DISTINCT FROM THE FOOTER */
  }
      <section id="about-us" className="py-20 bg-slate-100/90 text-[#0F172A] border-y border-slate-300/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {
    /* Left Content */
  }
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-3 py-1 rounded-full inline-block">
                REGIONAL INFRASTRUCTURE
              </span>
              <h2 className="text-2xl sm:4xl font-extrabold text-[#0F172A] mt-3 tracking-tight leading-tight">
                Built Specifically for Cross-Border Land Corridors
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 mt-4 leading-relaxed font-medium">
                Land trade between South Asia and Central Asia requires specialized coordination. Traditional marketplaces ignore bilateral permits, road haulage customs clearances, and multi-currency frontier arrangements.
              </p>
              <p className="text-xs sm:text-sm text-slate-700 mt-3 leading-relaxed font-medium">
                Border Export Hub bridges the gap with verified stakeholder registries, private deal-room encryption, and transparent road freight booking across the Quetta-Taftan, Zahedan-Mirjaveh, and Chaman-Spin Boldak routes.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5 text-xs">
                <span className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold shadow-xs flex items-center gap-1.5">
                  🇵🇰 <span>Quetta • Taftan • Karachi</span>
                </span>
                <span className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold shadow-xs flex items-center gap-1.5">
                  🇮🇷 <span>Zahedan • Mirjaveh • Bandar Abbas</span>
                </span>
                <span className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold shadow-xs flex items-center gap-1.5">
                  🇦🇫 <span>Kandahar • Spin Boldak • Kabul</span>
                </span>
              </div>
            </div>

            {
    /* Right Card: High-End Executive Card */
  }
            <div className="bg-white rounded-3xl p-7 sm:p-9 border-2 border-slate-200/90 shadow-xl shadow-slate-300/40 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h4 className="font-extrabold text-base text-[#0F172A] tracking-tight">Trust & Security Standards</h4>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Network
                </span>
              </div>

              <div className="space-y-4 text-xs text-slate-700">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="leading-relaxed">
                    <strong className="block text-slate-900 font-bold">Verified Identities:</strong>
                    Businesses submit tax, corporate, or chamber credentials before trading across bilateral checkpoints.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 font-bold">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div className="leading-relaxed">
                    <strong className="block text-slate-900 font-bold">Encrypted Documents:</strong>
                    CNIC, bill of lading, and tax records remain strictly private and accessible only to authorized deal participants and compliance staff.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="leading-relaxed">
                    <strong className="block text-slate-900 font-bold">Zero Fake Guarantees:</strong>
                    Transparent cross-border trade coordination without deceptive escrow or government-affiliation claims.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6.5. Contact Us Form with Server-Side WhatsApp Delivery */}
      <section id="contact" className="py-20 bg-[#071324] text-white relative overflow-hidden border-t-2 border-emerald-500/40">
        <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_#10B981]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
              <MessageCircle className="w-3.5 h-3.5" />
              Direct WhatsApp Trade Coordination
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Contact Our Trade Desk
            </h2>
            <p className="mt-3 text-slate-300 text-sm leading-relaxed">
              Submit your inquiry below. Our backend validates and delivers your complete commercial inquiry directly to our WhatsApp coordinator at <span className="text-emerald-400 font-bold">03324042186</span> without redirecting you away from the website.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Contact Info Card */}
            <div className="lg:col-span-4 bg-[#0c1a2d] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <h3 className="font-extrabold text-lg text-white mb-2">Border Export Hub Coordinator</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Fast-track your cross-border trade operations across Taftan / Mirjaveh, Chaman / Spin Boldak, and Rimdan / Gabd corridors.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#081525] border border-emerald-500/30">
                  <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Destination WhatsApp</div>
                    <div className="font-bold text-sm text-white">03324042186</div>
                    <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">Automated Server Delivery Active</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#081525] border border-blue-500/30">
                  <Mail className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Official Email</div>
                    <div className="font-bold text-sm text-white">Yasinsasoli186@gmail.com</div>
                    <div className="text-[10px] text-blue-400 font-semibold mt-0.5">Trade Coordinator Desk</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#081525] border border-slate-700/60">
                  <Headphones className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Operating Hours</div>
                    <div className="font-bold text-sm text-white">24/7 Bilateral Support</div>
                    <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Real-time convoy & clearance assistance</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Interactive Form Panel */}
            <div className="lg:col-span-8 bg-[#0b1728] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
              {inquiryFeedback && (
                <div
                  className={`mb-6 p-4 rounded-xl text-xs font-semibold flex items-start gap-3 ${
                    inquiryFeedback.type === "success"
                      ? "bg-emerald-950/80 border border-emerald-500 text-emerald-200"
                      : "bg-rose-950/80 border border-rose-500 text-rose-200"
                  }`}
                >
                  {inquiryFeedback.type === "success" ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div className="leading-relaxed">{inquiryFeedback.message}</div>
                </div>
              )}

              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Full Name <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tariq Mehmood"
                      value={inquiryForm.fullName}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, fullName: e.target.value })}
                      className="w-full text-xs p-3 bg-[#081525] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Phone Number <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 03001234567"
                      value={inquiryForm.phoneNumber}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, phoneNumber: e.target.value })}
                      className="w-full text-xs p-3 bg-[#081525] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Email Address <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. trader@company.com"
                      value={inquiryForm.email}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                      className="w-full text-xs p-3 bg-[#081525] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Address or City <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Quetta / Taftan / Zahedan"
                      value={inquiryForm.cityOrAddress}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, cityOrAddress: e.target.value })}
                      className="w-full text-xs p-3 bg-[#081525] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Inquiry Subject <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bulk Rice Export to Iran via Taftan border"
                    value={inquiryForm.subject}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, subject: e.target.value })}
                    className="w-full text-xs p-3 bg-[#081525] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Inquiry Message <span className="text-emerald-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your consignment specifications, required cargo capacity, destination terminal, or compliance requirements..."
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    className="w-full text-xs p-3 bg-[#081525] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between flex-wrap gap-4">
                  <div className="text-[11px] text-slate-400">
                    🔒 Submissions are protected against spam and logged securely in Border Export Hub.
                  </div>

                  <button
                    type="submit"
                    disabled={inquirySubmitting}
                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-2 cursor-pointer"
                  >
                    {inquirySubmitting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        Transmitting to WhatsApp...
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-4 h-4" />
                        Send Inquiry to WhatsApp Desk
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Footer: EXECUTIVE DESIGN WITH BRANDING & CLEAN FINISH */}
      <footer className="bg-[#030914] text-white pt-16 pb-12 border-t-2 border-emerald-500/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Col 1: Brand & Direct Support */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 font-black text-base shadow-lg shadow-emerald-500/30">
                BEH
              </div>
              <div>
                <span className="font-black text-xl text-white tracking-tight">
                  Border Export <span className="text-emerald-400">Hub</span>
                </span>
                <span className="block text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                  Global Trade. Brighter Together.
                </span>
              </div>
            </div>
            <p className="text-sm font-semibold leading-relaxed text-slate-300">
              The premier cross-border B2B trade, marketplace discovery, and road freight dispatch platform connecting Pakistan, Iran, and Afghanistan.
            </p>

            <div className="pt-2 p-4 rounded-2xl bg-[#08172b] border border-emerald-500/40 space-y-2.5 shadow-xl">
              <div className="font-extrabold text-emerald-400 text-xs uppercase tracking-wider flex items-center gap-2">
                <Headphones className="w-4 h-4 text-emerald-400" /> 24/7 Official Trade Support:
              </div>
              <div>
                <div className="font-extrabold text-white text-sm flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-400" /> WhatsApp: 03324042186
                </div>
              </div>
              <div>
                <a
                  href="mailto:Yasinsasoli186@gmail.com"
                  className="font-extrabold text-white hover:text-emerald-300 text-sm flex items-center gap-2 transition"
                >
                  <Mail className="w-4 h-4 text-emerald-400" /> Yasinsasoli186@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Marketplace */}
          <div>
            <h5 className="font-black text-white text-base mb-4 uppercase tracking-wider border-b border-slate-800 pb-2">
              Trade Marketplace
            </h5>
            <ul className="space-y-3 text-sm font-bold text-slate-200">
              <li><Link to="/marketplace?tab=products" className="hover:text-emerald-400 transition flex items-center gap-1.5"><span>•</span> Export Products</Link></li>
              <li><Link to="/marketplace?tab=demands" className="hover:text-emerald-400 transition flex items-center gap-1.5"><span>•</span> Buyer RFQ Demands</Link></li>
              <li><Link to="/marketplace?tab=transport" className="hover:text-emerald-400 transition flex items-center gap-1.5"><span>•</span> Transport & Freight</Link></li>
              <li><Link to="/news" className="hover:text-emerald-400 transition flex items-center gap-1.5"><span>•</span> Border & Market Intelligence</Link></li>
            </ul>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h5 className="font-black text-white text-base mb-4 uppercase tracking-wider border-b border-slate-800 pb-2">
              Platform Navigation
            </h5>
            <ul className="space-y-3 text-sm font-bold text-slate-200">
              <li><Link to="/dashboard" className="hover:text-emerald-400 transition flex items-center gap-1.5"><span>•</span> Trader Dashboard</Link></li>
              <li><Link to="/conversations" className="hover:text-emerald-400 transition flex items-center gap-1.5"><span>•</span> Deal Rooms</Link></li>
              <li><Link to="/shipments" className="hover:text-emerald-400 transition flex items-center gap-1.5"><span>•</span> Shipment Tracking</Link></li>
              <li>
                <button
                  onClick={() => setShowVerificationModal(true)}
                  className="text-left font-bold text-slate-200 hover:text-emerald-400 transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>•</span> Verification Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Land Crossings */}
          <div>
            <h5 className="font-black text-white text-base mb-4 uppercase tracking-wider border-b border-slate-800 pb-2">
              Supported Land Crossings
            </h5>
            <ul className="space-y-3 text-sm font-semibold text-slate-200">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 shadow-xs" />
                <span><strong className="text-white">Taftan / Mirjaveh</strong> (Pakistan ⇄ Iran)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 shadow-xs" />
                <span><strong className="text-white">Chaman / Spin Boldak</strong> (Pakistan ⇄ Afghanistan)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 shadow-xs" />
                <span><strong className="text-white">Rimdan / Gabd</strong> (Coastal Corridor)</span>
              </li>
              <li className="pt-2 text-xs font-bold text-emerald-400 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/30">
                🟢 Bilateral Corridor Compliance Active
              </li>
            </ul>
          </div>
        </div>

        {/* Footer bottom without the removed links, with updated copyright */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-800/80 flex items-center justify-center text-xs sm:text-sm font-bold text-slate-300 text-center">
          <div>© 2026 Border Export Hub. All rights reserved.</div>
        </div>
      </footer>

      {
    /* MODAL 1: Member-Only Access Protection (Blocks non-registered visitors from trade opportunities) */
  }
      {showMemberOnlyModal && <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#091524]">Member Access Required</h3>
                  <p className="text-xs text-slate-500">Registered Traders & Transporters Only</p>
                </div>
              </div>
              <button
    onClick={() => setShowMemberOnlyModal(false)}
    className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
  >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Full product specifications, trade negotiations, pricing contracts, and seller credentials are exclusively reserved for verified platform members (<strong>Importers, Exporters, and Transporters</strong>).
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
              <div>✓ Direct bilateral deal rooms</div>
              <div>✓ Wholesale pricing with origin vetting</div>
              <div>✓ Cross-border freight haulage booking</div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <Link
    to="/login"
    className="w-full text-center py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 hover:bg-slate-100 transition"
  >
                Sign In
              </Link>
              <Link
    to="/register"
    className="w-full text-center py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-xs"
  >
                Register as Member
              </Link>
            </div>
          </div>
        </div>}

      {
    /* MODAL 2: Educational Verification Requirements Guide */
  }
      {showVerificationModal && <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="bg-[#091524] text-white p-6 rounded-t-2xl flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-semibold mb-2 border border-emerald-500/30">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Corridor Trust & Compliance Guide
                </div>
                <h3 className="text-xl font-bold">What is Required for Verification?</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Learn how Border Export Hub verifies traders while protecting sensitive identity documents.
                </p>
              </div>
              <button
                onClick={() => setShowVerificationModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-[#0F172A]">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex gap-3 text-xs text-emerald-950">
                <Lock className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Strict Document Privacy Guarantee</strong>
                  Your CNIC, passport, tax numbers, and vehicle registration books are stored in encrypted private storage. They are <u>never</u> published publicly, shared with random traders, or exposed on search engines. Only licensed compliance reviewers can inspect them.
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Required Documents by Participant Role
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#091524]">
                      <Building2 className="w-4 h-4 text-emerald-600" />
                      <span>Exporters & Wholesale Buyers</span>
                    </div>
                    <ul className="text-xs text-slate-600 space-y-1.5 pl-1">
                      <li>• <strong>National Tax Number (NTN)</strong> or Chamber of Commerce Registration</li>
                      <li>• <strong>Valid CNIC / National ID / Passport</strong> of principal officer</li>
                      <li>• <strong>Commercial Address Proof</strong> (Utility bill or lease agreement)</li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#091524]">
                      <Truck className="w-4 h-4 text-teal-600" />
                      <span>Transporters & Drivers</span>
                    </div>
                    <ul className="text-xs text-slate-600 space-y-1.5 pl-1">
                      <li>• <strong>Commercial Driving License</strong> (HTV / International permit)</li>
                      <li>• <strong>Vehicle Registration Book</strong> with valid engine & chassis numbers</li>
                      <li>• <strong>Route Permit</strong> for bilateral border transit</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-[#091524] uppercase tracking-wider">
                  How the Verification Process Works
                </h4>
                <ol className="text-xs text-slate-600 space-y-2 list-decimal pl-4">
                  <li><strong>Register an account</strong> with your verified business email and role.</li>
                  <li><strong>Complete your profile</strong> with contact details and warehouse or dispatch location.</li>
                  <li><strong>Upload scans</strong> through the secure private document portal.</li>
                  <li><strong>Review by Compliance:</strong> Applications are inspected within 24-48 business hours.</li>
                </ol>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  onClick={() => setShowVerificationModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  Close Guide
                </button>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-xs"
                >
                  Start Registration
                </Link>
              </div>
            </div>
          </div>
        </div>}

      {/* MODAL 3: Get App Modal */}
      {showGetAppModal && <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#091524]">Get Border Export Hub App</h3>
                  <p className="text-xs text-slate-500">Android & iOS Cross-Border Edition</p>
                </div>
              </div>
              <button
                onClick={() => setShowGetAppModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Border Export Hub Mobile provides offline-tolerant messaging, voice notes at border crossings, live GPS location dispatch, and document camera uploads.
            </p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-2">
              <div className="text-xs font-bold text-slate-700">Scan QR or Access Mobile PWA</div>
              <div className="w-36 h-36 mx-auto bg-white border border-slate-300 rounded-lg flex items-center justify-center p-2 shadow-xs">
                <div className="grid grid-cols-4 gap-1 w-full h-full p-2 bg-slate-900 rounded">
                  <div className="bg-white col-span-2 row-span-2 rounded-xs" />
                  <div className="bg-emerald-400 rounded-xs" />
                  <div className="bg-white rounded-xs" />
                  <div className="bg-emerald-400 rounded-xs" />
                  <div className="bg-white rounded-xs" />
                  <div className="bg-white col-span-2 row-span-2 rounded-xs" />
                  <div className="bg-emerald-400 rounded-xs" />
                  <div className="bg-white rounded-xs" />
                </div>
              </div>
              <div className="text-[11px] text-slate-500">
                PWA is ready on your current mobile browser. Tap <strong>Share → Add to Home Screen</strong>.
              </div>
            </div>

            <div className="flex justify-end">
              <button
    onClick={() => setShowGetAppModal(false)}
    className="w-full py-2.5 rounded-xl bg-[#091524] text-white text-xs font-bold hover:bg-slate-800 transition shadow-xs"
  >
                Got It
              </button>
            </div>
          </div>
        </div>}
    </div>;
}
