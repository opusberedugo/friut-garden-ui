import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppNavBar from '../components/navigation/AppNavbar'
import Grid from '../components/layout/Grid'
import SideBar from '../components/navigation/SideBar'
import SideBarLink from '../components/navigation/SideBarLink'
import SidebarDivider from '../components/navigation/SidebarDivider'
import Toast from '../components/feedback/Toast'

// ── Status Badge ────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    'On Shipping': { bg: 'bg-orange-50', text: 'text-orange-500', dot: 'bg-orange-400' },
    'Arrived':     { bg: 'bg-green-50',  text: 'text-green-600',  dot: 'bg-green-500' },
    'Canceled':    { bg: 'bg-red-50',    text: 'text-red-500',    dot: 'bg-red-400' },
  };
  const style = map[status] || map['On Shipping'];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${style.bg} ${style.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
      {status}
    </span>
  );
}

// ── Order Item Row (image, title, price) ─────────────
function OrderItemRow({ item }) {
  const details = item.itemDetails || {};
  const name  = details.name  || 'Unknown Product';
  const price = item.priceAtPurchase ?? details.price ?? 0;
  const qty   = item.quantity || 1;
  const img   = details.imageUrl || details.image || `https://dummyimage.com/80x80/e8f5e9/1a4d2e&text=${encodeURIComponent(name.charAt(0))}`;

  return (
    <div className="flex items-start gap-4 py-3">
      <img src={img} alt={name} className="w-[72px] h-[72px] rounded-[10px] object-cover bg-gray-100 flex-shrink-0" />
      <div className="flex flex-col justify-center">
        <p className="text-[14px] font-semibold text-gray-900 leading-tight">{name}</p>
        <p className="text-[13px] text-gray-500 mt-1">MUR {price.toLocaleString()} &times; {qty}</p>
      </div>
    </div>
  );
}

// ── Single Order Card ────────────────────────────────
function OrderCard({ order }) {
  const addr     = order.deliveryAddress || {};
  const origin   = 'Farmers Market Depot';
  const dest     = addr.city ? `${addr.streetAddress}, ${addr.city}` : 'Your Address';
  const dateStr  = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

  return (
    <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden mb-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
      {/* Card Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          {/* Package icon */}
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span className="text-[14px] font-bold text-gray-900 tracking-tight">{order.orderId}</span>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Shipping Route */}
      <div className="flex items-center gap-2 px-6 py-3 bg-gray-50 border-b border-gray-100">
        {/* Origin */}
        <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
          <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="font-medium text-gray-700">{origin}</span>
        </div>

        {/* Dotted connector */}
        <div className="flex items-center gap-0.5 mx-2 flex-1">
          {Array.from({length: 7}).map((_,i) => (
            <span key={i} className="flex-1 h-px bg-gray-300 border-dashed"></span>
          ))}
        </div>

        {/* Estimated date */}
        <span className="text-[11px] text-gray-400 font-medium hidden sm:block">Est. {dateStr}</span>

        <div className="flex items-center gap-0.5 mx-2 flex-1 hidden sm:flex">
          {Array.from({length: 7}).map((_,i) => (
            <span key={i} className="flex-1 h-px bg-gray-300"></span>
          ))}
        </div>

        {/* Destination */}
        <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
          <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-medium text-gray-700">{dest}</span>
        </div>
      </div>

      {/* Items List */}
      <div className="px-6 divide-y divide-gray-100">
        {(order.items || []).map((item, idx) => (
          <OrderItemRow key={item.item?.toString() || idx} item={item} />
        ))}
      </div>

      {/* Card Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
        <span className="text-[14px] text-gray-700">
          Total: <span className="font-bold text-gray-900">MUR {(order.totalAmount || 0).toLocaleString()}</span>
        </span>
        <button className="text-[13px] font-semibold text-gray-700 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors">
          Details
        </button>
      </div>
    </div>
  );
}

// ── Tab Selector ─────────────────────────────────────
const TABS = ['On Shipping', 'Arrived', 'Canceled'];

function TabBar({ activeTab, setActiveTab, counts }) {
  return (
    <div className="flex gap-1 mb-8 border-b border-gray-200">
      {TABS.map(tab => {
        const count = counts[tab] || 0;
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-5 py-3 text-[14px] font-semibold transition-colors focus:outline-none ${
              isActive ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}
            {count > 0 && (
              <span className={`ml-2 text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                isActive ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-500'
              }`}>{count}</span>
            )}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-900 rounded-t-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── Main Page ────────────────────────────────────────
export default function OrdersPage() {
  const navigate  = useNavigate();
  const apiURL    = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('On Shipping');
  const [toast, setToast] = useState({ open: false, message: '', variant: 'success' });

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('fm_token');
      if (token) {
        await fetch(`${apiURL}/logout`, { method: "POST", headers: { 'Authorization': `Bearer ${token}` } });
      }
    } catch (e) { console.error(e); }
    localStorage.removeItem('fm_token');
    window.location.href = "/login";
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('fm_token');
        if (!token) { navigate('/login'); return; }

        setLoading(true);
        const res = await fetch(`${apiURL}/get-orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            localStorage.removeItem('fm_token');
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch orders');
        }

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
        setToast({ open: true, message: 'Failed to load orders.', variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [apiURL, navigate]);

  // Derive tab counts & filtered results
  const counts = TABS.reduce((acc, tab) => {
    acc[tab] = orders.filter(o => o.status === tab).length;
    return acc;
  }, {});

  const filtered = orders.filter(o => o.status === activeTab);

  return (
    <>
      <Toast
        open={toast.open}
        message={toast.message}
        variant={toast.variant}
        onClose={() => setToast({ ...toast, open: false })}
      />
      <AppNavBar />
      <Grid className="grid-cols-5">

        {/* ── Sidebar (identical to Cart/Wishlist) ── */}
        <SideBar className="col-span-1">
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Cart" href="/profile">Cart</SideBarLink>
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Wishlist" href="/profile/wishlist">Wishlist</SideBarLink>
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Preferences" href="/profile/preferences">Preferences</SideBarLink>
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Orders" href="/profile/orders">Orders</SideBarLink>

          <SidebarDivider />

          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Sales Dashboard" href="/profile/sales/dashboard">Sales Dashboard</SideBarLink>
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Products" href="/profile/sales/products">My Products</SideBarLink>
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Orders" href="/profile/sales/orders">My Orders</SideBarLink>
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Reviews" href="/profile/sales/reviews">My Reviews</SideBarLink>

          <SidebarDivider />
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Profile" href="/profile">Profile Settings</SideBarLink>
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Settings" href="/settings">Account Settings</SideBarLink>
          <SideBarLink className="text-red-500 bg-transparent hover:bg-transparent hover:text-red-600" text="Log Out" onClick={handleLogout}>Log Out</SideBarLink>
        </SideBar>

        {/* ── Main Content ── */}
        <div className="col-span-4 w-full px-12 mt-12 min-h-screen pt-8 pb-32">
          <div className="max-w-4xl">

            <h2 className="text-[28px] font-bold text-gray-900 mb-8">My Orders</h2>

            {/* Tab Bar */}
            <TabBar activeTab={activeTab} setActiveTab={setActiveTab} counts={counts} />

            {/* Order List */}
            {loading ? (
              <div className="py-20 text-center text-gray-400 font-medium">Loading your orders...</div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center">
                <div className="text-4xl mb-4">📦</div>
                <p className="text-gray-500 font-medium">No orders here yet.</p>
                {activeTab === 'On Shipping' && (
                  <button
                    onClick={() => navigate('/home')}
                    className="mt-6 text-sm text-forest-600 underline hover:text-forest-800 transition-colors"
                  >
                    Start shopping
                  </button>
                )}
              </div>
            ) : (
              <div>
                {filtered.map(order => (
                  <OrderCard key={order._id?.toString() || order.orderId} order={order} />
                ))}
              </div>
            )}

          </div>
        </div>

      </Grid>
    </>
  );
}
