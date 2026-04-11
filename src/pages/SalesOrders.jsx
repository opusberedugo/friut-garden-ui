import React, { useState, useEffect } from "react";
import SellerLayout from "../components/layout/SellerLayout";

const STATUS_STYLES = {
  "On Shipping":  "bg-blue-50 text-blue-600",
  "Delivered":    "bg-green-50 text-green-600",
  "Cancelled":    "bg-red-50 text-red-500",
  "Processing":   "bg-orange-50 text-orange-500",
};

export default function SalesOrders() {
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${apiURL}/get-seller-orders`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("fm_token")}` },
        });
        if (res.ok) setOrders(await res.json());
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, [apiURL]);

  return (
    <SellerLayout>
      <div className="max-w-5xl px-4 md:px-12 pt-8 w-full">
        <h2 className="text-[28px] font-bold text-gray-900 mb-1">My Orders</h2>
        <p className="text-gray-500 mb-8">Customer orders that contain your listed products.</p>

        {loading ? (
          <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center shadow-[0_4px_24px_rgba(0,0,0,0.02)] min-h-[300px]">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Orders Yet</h3>
            <p className="text-gray-500 max-w-sm">Orders containing your products will appear here as customers place them.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map(order => (
              <div key={order._id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-bold text-gray-900 text-base">{order.orderId}</p>
                    <p className="text-sm text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLES[order.status] || "bg-gray-100 text-gray-600"}`}>
                      {order.status}
                    </span>
                    <span className="font-bold text-forest-600 text-sm">MUR {order.sellerTotal?.toFixed(2)}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="flex flex-col gap-2 mb-4">
                  {order.items.map((oi, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5">
                      {oi.itemInfo?.images?.[0] ? (
                        <img src={oi.itemInfo.images[0]} alt={oi.itemInfo?.name} className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <img
                          src={`https://dummyimage.com/40x40/e8f5e9/1a4d2e&text=${encodeURIComponent((oi.itemInfo?.name || 'P').charAt(0))}`}
                          alt={oi.itemInfo?.name || 'Item'}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{oi.itemInfo?.name || "Unknown Item"}</p>
                        <p className="text-xs text-gray-400">Qty: {oi.quantity} × MUR {oi.priceAtPurchase?.toFixed(2)}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-700">MUR {(oi.quantity * oi.priceAtPurchase).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                {/* Delivery Address */}
                {order.deliveryAddress && (
                  <div className="border-t border-gray-100 pt-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <p className="text-xs text-gray-500 truncate">
                      {[order.deliveryAddress.streetAddress, order.deliveryAddress.city, order.deliveryAddress.district].filter(Boolean).join(", ")}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </SellerLayout>
  );
}
