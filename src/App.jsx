import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Page Components
import HomePage from "./pages/HomePage.jsx";
import MarketplacePage from "./pages/MarketplacePage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import DemandsPage from "./pages/DemandsPage.jsx";
import VehiclesPage from "./pages/VehiclesPage.jsx";
import TransportPage from "./pages/TransportPage.jsx";
import ConversationsPage from "./pages/ConversationsPage.jsx";
import ShipmentsPage from "./pages/ShipmentsPage.jsx";
import NewsPage from "./pages/NewsPage.jsx";
import VerificationPage from "./pages/VerificationPage.jsx";
import CompliancePage from "./pages/CompliancePage.jsx";
import AdminVerificationPage from "./pages/AdminVerificationPage.jsx";
import DocumentsPage from "./pages/DocumentsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/marketplace" element={<MarketplacePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/demands" element={<DemandsPage />} />
      <Route path="/vehicles" element={<VehiclesPage />} />
      <Route path="/transport" element={<TransportPage />} />
      <Route path="/conversations" element={<ConversationsPage />} />
      <Route path="/conversations/:id" element={<ConversationsPage />} />
      <Route path="/shipments" element={<ShipmentsPage />} />
      <Route path="/shipments/:id" element={<ShipmentsPage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/verification" element={<VerificationPage />} />
      <Route path="/compliance" element={<CompliancePage />} />
      <Route path="/admin/verification" element={<AdminVerificationPage />} />
      <Route path="/documents" element={<DocumentsPage />} />
      <Route path="/profile/:id" element={<ProfilePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
