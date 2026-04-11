import React, { useState, useEffect } from "react";
import SellerLayout from "../components/layout/SellerLayout";
import Alert from "../components/feedback/Alert";
import Toast from "../components/feedback/Toast";
import FormField from "../components/forms/FormField";

const UNITS = ["kg", "g", "litre", "ml", "piece", "bunch", "packet", "box", "bag", "crate"];
const SEASONS = ["Year-round", "Rainy Season", "Dry Season", "Summer", "Winter", "Spring"];

export default function SalesProducts() {
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [alertState, setAlertState] = useState({ open: false, variant: "info", title: "", message: "" });
  const [toastState, setToastState] = useState({ open: false, variant: "success", message: "" });

  const emptyForm = { name: "", description: "", categoryId: "", price: "", unit: "kg", stock: "", season: "Year-round", organic: false, tags: "" };
  const [form, setForm]     = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const token = () => localStorage.getItem("fm_token");

  useEffect(() => { fetchProducts(); fetchCategories(); }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch(`${apiURL}/get-seller-products`, { headers: { Authorization: `Bearer ${token()}` } });
      if (res.ok) setProducts(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function fetchCategories() {
    try {
      const res = await fetch(`${apiURL}/get-categories`);
      if (res.ok) setCategories(await res.json());
    } catch (e) { console.error(e); }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim())        errs.name = "Product name is required.";
    if (!form.description.trim()) errs.description = "Description is required.";
    if (!form.categoryId)         errs.categoryId = "Please select a category.";
    if (!form.price || isNaN(form.price) || parseFloat(form.price) <= 0) errs.price = "Enter a valid price.";
    if (!form.stock || isNaN(form.stock) || parseInt(form.stock) < 0)    errs.stock = "Enter a valid stock quantity.";
    setErrors(errs);
    return Object.keys(errs).length === 0; // true = valid
  }

  async function handleSubmit() {
    const isValid = validate();
    if (!isValid) {
      setAlertState({ open: true, variant: "error", title: "Incomplete Form", message: "Please fill in all required fields before publishing." });
      return;
    }
    setSubmitting(true);
    try {
      const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock), tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) };
      const res = await fetch(`${apiURL}/create-product`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setDrawerOpen(false);
        setForm(emptyForm);
        setErrors({});
        setToastState({ open: true, variant: "success", message: "Product listed successfully!" });
        fetchProducts();
      } else {
        const data = await res.json();
        setAlertState({ open: true, variant: "error", title: "Failed to list product", message: data.message || "Please try again." });
      }
    } catch (err) {
      setAlertState({ open: true, variant: "error", title: "Network Error", message: "Could not connect to the server." });
    } finally { setSubmitting(false); }
  }

  return (
    <SellerLayout>
      <Toast open={toastState.open} variant={toastState.variant} message={toastState.message} position="top-right" duration={4000} onClose={() => setToastState(p => ({ ...p, open: false }))} />

      <div className="max-w-5xl px-12 pt-8 w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-[28px] font-bold text-gray-900 mb-1">My Products</h2>
            <p className="text-gray-500">Manage your active listings, edit pricing, and organize inventory.</p>
          </div>
          <button onClick={() => setDrawerOpen(true)} className="bg-forest-500 hover:bg-forest-600 transition-colors text-white px-6 py-2.5 rounded-lg font-medium shadow-sm flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            List New Product
          </button>
        </div>

        {loading ? (
          <p className="text-gray-400 animate-pulse mt-16 text-center">Loading your products…</p>
        ) : products.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-[2rem] p-12 mt-4 flex flex-col items-center justify-center text-center shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Products Published</h3>
            <p className="text-gray-500 max-w-sm">Click <strong>List New Product</strong> to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {products.map(p => (
              <div key={p._id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex gap-4 items-start">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt={p.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0 bg-gray-50" />
                ) : (
                  <img
                    src={`https://dummyimage.com/80x80/e8f5e9/1a4d2e&text=${encodeURIComponent((p.name || 'P').charAt(0))}`}
                    alt={p.name}
                    className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{p.name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{p.description}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-forest-600 font-bold text-sm">MUR {p.price?.toFixed(2)}</span>
                    <span className="text-xs text-gray-400">/{p.unit}</span>
                    <span className={`ml-auto text-xs font-medium px-2.5 py-0.5 rounded-full ${p.stock > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                      {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Backdrop */}
      {drawerOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setDrawerOpen(false)} />}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-bold text-gray-900">List New Product</h3>
            <p className="text-sm text-gray-500 mt-0.5">Fill in the details to publish your listing.</p>
          </div>
          <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <Alert open={alertState.open} variant={alertState.variant} title={alertState.title} message={alertState.message} onClose={() => setAlertState(p => ({ ...p, open: false }))} />

          <div className="flex flex-col gap-5">
            <FormField name="name" label="Product Name" type="text" placeholder="e.g. Organic Tomatoes" value={form.name} onChange={handleChange} required error={errors.name} />

            <div className="form-field">
              <label className="block text-gray-700 font-medium mb-2">Description <span className="text-red-500">*</span></label>
              <textarea name="description" rows="3" value={form.description} onChange={handleChange} placeholder="Describe your product — freshness, origin, how it's grown…"
                className={`w-full px-4 py-3 bg-white border ${errors.description ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors resize-none`} />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="form-field">
              <label className="block text-gray-700 font-medium mb-2">Category <span className="text-red-500">*</span></label>
              <select name="categoryId" value={form.categoryId} onChange={handleChange}
                className={`w-full px-4 py-3 bg-white border ${errors.categoryId ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition-colors`}>
                <option value="">Select a category…</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField name="price" label="Price (MUR)" type="number" placeholder="0.00" value={form.price} onChange={handleChange} required error={errors.price} />
              <div className="form-field">
                <label className="block text-gray-700 font-medium mb-2">Unit</label>
                <select name="unit" value={form.unit} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition-colors">
                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField name="stock" label="Stock Available" type="number" placeholder="0" value={form.stock} onChange={handleChange} required error={errors.stock} />
              <div className="form-field">
                <label className="block text-gray-700 font-medium mb-2">Season</label>
                <select name="season" value={form.season} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition-colors">
                  {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <FormField name="tags" label="Tags (comma-separated)" type="text" placeholder="e.g. organic, pesticide-free, bulk" value={form.tags} onChange={handleChange} />

            <div className="flex items-center gap-3 py-1">
              <input type="checkbox" id="organic" name="organic" checked={form.organic} onChange={handleChange} className="w-4 h-4 accent-green-600 cursor-pointer" />
              <label htmlFor="organic" className="text-gray-700 font-medium cursor-pointer">Certified Organic</label>
            </div>
          </div>
        </div>

        <div className="px-8 py-5 border-t border-gray-100 flex gap-3">
          <button type="button" onClick={() => setDrawerOpen(false)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} disabled={submitting}
            className="flex-1 py-3 rounded-xl bg-forest-500 hover:bg-forest-600 disabled:opacity-60 text-white font-semibold transition-colors">
            {submitting ? "Publishing…" : "Publish Listing"}
          </button>
        </div>
      </div>
    </SellerLayout>
  );
}
