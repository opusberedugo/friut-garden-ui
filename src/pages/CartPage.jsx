import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppNavBar from '../components/navigation/AppNavbar'
import Grid from '../components/layout/Grid'
import SideBar from '../components/navigation/SideBar'
import SideBarLink from '../components/navigation/SideBarLink'
import SidebarDivider from '../components/navigation/SidebarDivider'

import CartCard from '../components/ecommerce/CartCard'
import CartItem from '../components/ecommerce/CartItem'
import QuantitySelector from '../components/ecommerce/QuantitySelector'
import PromoInput from '../components/ecommerce/PromoInput'
import SummaryRow from '../components/ecommerce/SummaryRow'
import UIButton from '../components/ui/Button'
import Toast from '../components/feedback/Toast'
import Alert from '../components/feedback/Alert'

export default function CartPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', variant: 'success' });
  const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('fm_token');
      if (!token) {
        navigate('/login');
        return;
      }

      setLoading(true);
      const res = await fetch(`${apiURL}/get-cart`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('fm_token');
          navigate('/login');
          return;
        }
        throw new Error("Failed to fetch cart");
      }

      const cartData = await res.json();
      setProducts(cartData);
    } catch (err) {
      console.error(err);
      setToast({ open: true, message: 'Failed to load cart', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const syncQuantityData = async (itemId, currentQuantity, change) => {
    // Optimistic UI Update
    const newQuantity = currentQuantity + change;
    if (newQuantity <= 0) {
       return handleRemove(itemId);
    }

    setProducts(prev => prev.map(p => p.item === itemId ? { ...p, quantity: newQuantity } : p));

    try {
      const token = localStorage.getItem('fm_token');
      const res = await fetch(`${apiURL}/update-cart-quantity`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ itemId, quantity: newQuantity })
      });
      if (!res.ok) throw new Error("Failed to sync backend");
    } catch (err) {
      console.error("Sync error:", err);
      // Revert optimistic update gracefully (simplest is to just refetch)
      fetchCart();
      setToast({ open: true, message: 'Could not update quantity. Please try again.', variant: 'error' });
    }
  };

  const handleIncrement = (itemId, currentQuantity) => {
    syncQuantityData(itemId, currentQuantity, 1);
  };

  const handleDecrement = (itemId, currentQuantity) => {
    syncQuantityData(itemId, currentQuantity, -1);
  };

  const handleRemove = async (itemId) => {
    // Optimistic remove
    const backupProducts = [...products];
    setProducts(prev => prev.filter(p => p.item !== itemId));

    try {
      const token = localStorage.getItem('fm_token');
      const res = await fetch(`${apiURL}/remove-from-cart`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ itemId })
      });
      if (!res.ok) throw new Error("Failed to remove");
      setToast({ open: true, message: 'Item removed from cart', variant: 'success' });
    } catch (err) {
      setProducts(backupProducts);
      setToast({ open: true, message: 'Could not remove item.', variant: 'error' });
    }
  };

  const [alertOpen, setAlertOpen] = useState(false);

  const executeClearCart = async () => {
    setAlertOpen(false);
    try {
      const token = localStorage.getItem('fm_token');
      const res = await fetch(`${apiURL}/clear-cart`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to clear cart");
      setProducts([]);
      setToast({ open: true, message: 'Cart cleared', variant: 'success' });
    } catch (err) {
      setToast({ open: true, message: 'Failed to clear cart.', variant: 'error' });
    }
  };

  const handleClearCart = () => {
    setAlertOpen(true);
  };

  const subtotal = products.reduce((acc, p) => {
    const price = p.itemDetails?.price ? Number(p.itemDetails.price) : 0;
    return acc + (price * p.quantity);
  }, 0);
  const discount = 0;
  const total = subtotal - discount;

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('fm_token');
      if (token) {
        await fetch(`${apiURL}/logout`, { method: "POST", headers: { 'Authorization': `Bearer ${token}` } });
      }
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem('fm_token');
    window.location.href = "/login";
  };

  return (
    <>
      <Toast 
        open={toast.open} 
        message={toast.message} 
        variant={toast.variant} 
        onClose={() => setToast({ ...toast, open: false })} 
      />
      
      <Alert 
        open={alertOpen}
        variant="warning"
        title="Clear Cart"
        message="Are you sure you want to completely clear your cart? This action cannot be undone."
        backdrop={true}
        blur={true}
        onClose={() => setAlertOpen(false)}
        actions={[
          { label: "Cancel", onClick: () => setAlertOpen(false), secondary: true },
          { label: "Clear Cart", onClick: executeClearCart }
        ]}
      />

      <AppNavBar />
      <Grid className="grid-cols-5 ">
        <SideBar className="col-span-1">
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Cart" href="/profile" >Cart</SideBarLink>
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Wishlist" href="/profile/wishlist" >Wishlist</SideBarLink>
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Preferences" href="/profile/preferences" >Preferences</SideBarLink>
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Orders" href="/profile/orders" >Orders</SideBarLink>

          <SidebarDivider/>

          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Sales Dashboard" href="/profile/sales/dashboard" >Sales Dashboard</SideBarLink>
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Products" href="/profile/sales/products" >My Products</SideBarLink>
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Orders" href="/profile/sales/orders" >My Orders</SideBarLink>
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Reviews" href="/profile/sales/reviews" >My Reviews</SideBarLink>

          <SidebarDivider/>

          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Profile" href="/profile" >Profile Settings</SideBarLink>
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Settings" href="/settings" >Account Settings</SideBarLink>
          <SideBarLink className="text-red-500 bg-transparent hover:bg-transparent hover:text-red-600" text="Log Out" onClick={handleLogout} >Log Out</SideBarLink>
        </SideBar>

        {/* Cart Page Content */}
        <Grid className="col-span-4 w-full grid grid-cols-3 gap-4 items-start px-8 mt-12">
             
          {/* Left Pane: Items */}
          <CartCard className="col-span-2 border border-gray-100 bg-white h-auto p-8 rounded-[2rem] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <h2 className="text-[28px] font-medium text-gray-900 tracking-tight">Cart</h2>
                <span className="text-gray-400 text-sm mt-1">({products.length} products)</span>
              </div>
              {products.length > 0 && (
                <button onClick={handleClearCart} className="text-[#FF4A4A] hover:text-red-600 text-[13px] font-semibold flex items-center gap-1.5 transition-colors">
                  <span className="text-lg leading-none shrink-0 mb-0.5">&times;</span> Clear cart
                </button>
              )}
            </div>

            <div className="w-full">
              {loading ? (
                <div className="py-20 text-center text-gray-400 font-medium">Loading your cart securely...</div>
              ) : (
                <>
                  <div className="hidden sm:flex justify-between text-gray-900 text-[13px] font-bold mb-4 px-4 w-full">
                    <span className="w-1/2">Product</span>
                    <div className="flex justify-between items-center w-1/2 pl-4">
                      <span className="w-24 text-center">Count</span>
                      <span className="w-24 text-right">Price</span>
                      <span className="w-8"></span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    {products.map(p => {
                      const details = p.itemDetails || {};
                      return (
                        <CartItem 
                            key={p._id || p.item} 
                            image={details.imageUrl || details.image || "https://dummyimage.com/100x100/f4f5f9/1a4d2e&text=Fruit"} 
                            title={details.name || "Unknown Product"} 
                            subtitle={details.season || "N/A"}
                        >
                          <div className="flex items-center justify-between w-full pl-0 sm:pl-4">
                              <div className="w-24 flex justify-center">
                                <QuantitySelector 
                                  count={p.quantity} 
                                  onIncrement={() => handleIncrement(p.item, p.quantity)} 
                                  onDecrement={() => handleDecrement(p.item, p.quantity)} 
                                />
                              </div>
                              <span className="font-bold text-[15px] text-gray-900 w-24 text-right whitespace-nowrap">
                                ${(Number(details.price) || 0).toFixed(2)}
                              </span>
                              <button onClick={() => handleRemove(p.item)} className="w-8 flex justify-end text-[#FF4A4A] hover:text-red-600 font-medium text-lg transition-colors">
                                &times;
                              </button>
                          </div>
                        </CartItem>
                      );
                    })}
                    {products.length === 0 && (
                      <div className="text-center py-12">
                        <p className="text-gray-500 font-medium">Your cart is currently empty.</p>
                        <UIButton onClick={() => navigate("/search?query=")} text="Browse Marketplace" className="bg-lime-500 text-white px-6 py-2 rounded-full mt-4 hover:bg-lime-600 transition-colors" />
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </CartCard>

          {/* Right Pane: Summary */}
          <CartCard className="bg-[#F6F7F9] border border-[#F6F7F9] shadow-none xl:sticky xl:top-8 h-auto p-8 rounded-[2rem]">
            <h3 className="text-[17px] font-bold text-gray-900">Order Summary</h3>            

            <div className="mt-6 flex flex-col gap-1">
              <SummaryRow label="Subtotal" value={`MUR ${subtotal.toFixed(2)}`} />
              <SummaryRow label="Discount" value={`-MUR ${discount.toFixed(2)}`} />
              <SummaryRow label="Total" value={`MUR ${total.toFixed(2)}`} isTotal />
            </div>

            <UIButton 
              text="Continue to checkout" 
              className="w-full bg-forest-500 text-white py-4 mt-6 rounded-[1rem] font-medium hover:bg-lime-700 transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={() => navigate("/checkout")}
              disabled={products.length === 0}
            />
          </CartCard>

        </Grid>
      </Grid>
    </>
  )
}
