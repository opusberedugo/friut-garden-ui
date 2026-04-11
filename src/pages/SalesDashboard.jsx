import React, { useState, useEffect } from "react";
import SellerLayout from "../components/layout/SellerLayout";

function StatCard({ label, value, sub, icon, color = "text-gray-900" }) {
  return (
    <div className="bg-white border border-gray-100 p-6 rounded-[1.5rem] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center">{icon}</div>
      </div>
      <p className={`text-2xl font-bold ${color} mb-0.5`}>{value}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

export default function SalesDashboard() {
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${apiURL}/get-seller-stats`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("fm_token")}` },
        });
        if (res.ok) setStats(await res.json());
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, [apiURL]);

  return (
    <SellerLayout>
      <div className="max-w-5xl px-4 md:px-12 pt-8 w-full">
        <h2 className="text-[28px] font-bold text-gray-900 mb-1">Sales Dashboard</h2>
        <p className="text-gray-500 mb-8">Your live merchant overview — revenue, shipments, and community standing.</p>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-[1.5rem] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-10">
            <StatCard
              label="Gross Revenue"
              value={`MUR ${(stats?.grossRevenue || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              sub="All-time earnings"
              color="text-forest-700"
              icon={<svg className="w-5 h-5 text-forest-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StatCard
              label="Active Shipments"
              value={stats?.activeOrdersCount ?? 0}
              sub="Orders on delivery"
              color="text-blue-600"
              icon={<svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l-3-3m3 3l3-3" /></svg>}
            />
            <StatCard
              label="Listed Products"
              value={stats?.productCount ?? 0}
              sub="Items in your catalog"
              icon={<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
            />
            <StatCard
              label="Customer Reviews"
              value={stats?.reviewCount ?? 0}
              sub="Community feedback"
              color="text-yellow-600"
              icon={<svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}
            />
          </div>
        )}

        <div className="bg-gray-50 border border-gray-100 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center min-h-[220px]">
          <svg className="w-10 h-10 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          <h3 className="text-base font-semibold text-gray-700 mb-1">Revenue Chart</h3>
          <p className="text-sm text-gray-400">Sales analytics and rich charting will be available soon.</p>
        </div>
      </div>
    </SellerLayout>
  );
}
