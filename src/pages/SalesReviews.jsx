import React, { useState, useEffect } from "react";
import SellerLayout from "../components/layout/SellerLayout";

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`w-4 h-4 ${i <= Math.round(rating) ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function SalesReviews() {
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("all"); // all | 1..5

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${apiURL}/get-seller-reviews`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("fm_token")}` },
        });
        if (res.ok) setReviews(await res.json());
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, [apiURL]);

  const displayed = filter === "all" ? reviews : reviews.filter(r => Math.round(r.rating) === parseInt(filter));
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <SellerLayout>
      <div className="max-w-5xl px-4 md:px-12 pt-8 w-full">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-[28px] font-bold text-gray-900 mb-1">My Reviews</h2>
            <p className="text-gray-500">Community feedback across all your listed products.</p>
          </div>
          {avgRating && (
            <div className="bg-white border border-gray-100 rounded-2xl px-6 py-4 text-center shadow-sm">
              <p className="text-3xl font-bold text-yellow-500">{avgRating}</p>
              <StarRating rating={parseFloat(avgRating)} />
              <p className="text-xs text-gray-400 mt-1">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
            </div>
          )}
        </div>

        {!loading && reviews.length > 0 && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            {["all","5","4","3","2","1"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === f ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {f === "all" ? "All" : `${f} ★`}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center shadow-[0_4px_24px_rgba(0,0,0,0.02)] min-h-[300px]">
            <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Reviews Yet</h3>
            <p className="text-gray-500 max-w-sm">Great product imagery and descriptions tend to invite solid customer feedback!</p>
          </div>
        ) : displayed.length === 0 ? (
          <p className="text-gray-400 text-center py-12">No reviews matching this filter.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {displayed.map(r => (
              <div key={r._id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                <div className="flex items-start gap-4">
                  {r.itemInfo?.images?.[0] ? (
                    <img src={r.itemInfo.images[0]} alt={r.itemInfo?.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <img
                      src={`https://dummyimage.com/56x56/e8f5e9/1a4d2e&text=${encodeURIComponent((r.itemInfo?.name || 'P').charAt(0))}`}
                      alt={r.itemInfo?.name || 'Product'}
                      className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium text-gray-400 truncate">{r.itemInfo?.name || "Unknown Product"}</p>
                      <p className="text-xs text-gray-300 ml-4 flex-shrink-0">{new Date(r.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>
                    <StarRating rating={r.rating} />
                    {r.title && <p className="font-semibold text-gray-900 mt-2">{r.title}</p>}
                    {r.body  && <p className="text-sm text-gray-600 mt-1 leading-relaxed">{r.body}</p>}
                    <p className="text-xs text-gray-400 mt-3">— {r.firstName} {r.lastName}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SellerLayout>
  );
}
