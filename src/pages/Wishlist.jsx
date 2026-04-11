import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppNavBar from '../components/navigation/AppNavbar'
import Grid from '../components/layout/Grid'
import SideBar from '../components/navigation/SideBar'
import SideBarLink from '../components/navigation/SideBarLink'
import SidebarDivider from '../components/navigation/SidebarDivider'

import WishlistItem from '../components/ecommerce/WishlistItem'
import Toast from '../components/feedback/Toast'

export default function Wishlist() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', variant: 'success' });
  const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('fm_token');
      if (!token) {
        navigate('/login');
        return;
      }

      setLoading(true);
      const res = await fetch(`${apiURL}/get-wishlist`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('fm_token');
          navigate('/login');
          return;
        }
        throw new Error("Failed to fetch wishlist");
      }

      const data = await res.json();
      setWishlist(data);
    } catch (err) {
      console.error(err);
      setToast({ open: true, message: 'Failed to load wishlist', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    const backup = [...wishlist];
    setWishlist(prev => prev.filter(p => p.item !== itemId));

    try {
      const token = localStorage.getItem('fm_token');
      const res = await fetch(`${apiURL}/remove-from-wishlist`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ itemId })
      });
      if (!res.ok) throw new Error("Failed to remove item");
      setToast({ open: true, message: 'Item removed from wishlist', variant: 'success' });
    } catch (err) {
      setWishlist(backup);
      setToast({ open: true, message: 'Could not remove item', variant: 'error' });
    }
  };

  const handleAddToCart = async (itemId) => {
    try {
      const token = localStorage.getItem('fm_token');
      const res = await fetch(`${apiURL}/add-to-cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ itemId, quantity: 1 })
      });
      if (!res.ok) throw new Error("Failed to add to cart");
      setToast({ open: true, message: 'Item successfully added to cart!', variant: 'success' });
    } catch (err) {
      setToast({ open: true, message: 'Failed to add item to cart', variant: 'error' });
    }
  };

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

  return (
    <>
      <Toast
        open={toast.open}
        message={toast.message}
        variant={toast.variant}
        onClose={() => setToast({ ...toast, open: false })}
      />
      <AppNavBar />
      <Grid className="grid-cols-5 ">
        <SideBar className="col-span-1">
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Cart" href="/profile" >Cart</SideBarLink>
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Wishlist" href="/profile/wishlist" >Wishlist</SideBarLink>
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Preferences" href="/profile/preferences" >Preferences</SideBarLink>
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Orders" href="/profile/orders" >Orders</SideBarLink>

          <SidebarDivider />

          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Sales Dashboard" href="/profile/sales/dashboard" >Sales Dashboard</SideBarLink>
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Products" href="/profile/sales/products" >My Products</SideBarLink>
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Orders" href="/profile/sales/orders" >My Orders</SideBarLink>
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Reviews" href="/profile/sales/reviews" >My Reviews</SideBarLink>

          <SidebarDivider />
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Profile" href="/profile" >Profile Settings</SideBarLink>
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Settings" href="/settings" >Account Settings</SideBarLink>
          <SideBarLink className="text-red-500 bg-transparent hover:bg-transparent hover:text-red-600" text="Log Out" onClick={handleLogout} >Log Out</SideBarLink>
        </SideBar>

        {/* Wishlist Page Content */}
        <div className="col-span-4 w-full px-8 mt-12 min-h-screen pt-8 pb-32 px-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-[28px] font-bold text-gray-900 mb-8">My Wishlist</h2>

            {/* Header Row */}
            {/* <div className="hidden lg:grid grid-cols-12 gap-4 pb-4 border-b border-gray-200 text-gray-400 text-sm font-medium"> */}
              {/* <div className="col-span-4">Product</div> */}
              {/* <div className="col-span-2 text-center">Size/Spec</div> */}
              {/* <div className="col-span-2 text-center">Quantity</div> */}
              {/* <div className="col-span-2 text-center">Amount</div> */}
              {/* <div className="col-span-1 text-center">Delete</div> */}
              {/* <div className="col-span-1 border-r-0"></div> */}
            {/* </div> */}

            {/* List */}
            <div className="flex flex-col ">
              {loading ? (
                <div className="py-20 text-center text-gray-400 font-medium bg-white border border-t-0 border-gray-100">Loading your wishlist...</div>
              ) : wishlist.length === 0 ? (
                <div className="py-20 text-center bg-white border border-t-0 border-gray-100">
                  <p className="text-gray-500 font-medium">Your wishlist is empty.</p>
                </div>
              ) : (
                wishlist.map(p => {
                  const details = p.itemDetails || {};
                  return (
                    <WishlistItem
                      key={p._id || p.item}
                      image={details.imageUrl || details.image || "https://dummyimage.com/100x100/f4f5f9/1a4d2e&text=Fruit"}
                      title={details.name || "Unknown Product"}
                      subtitle={details.description || details.season || "N/A"}
                      badge={details.discountPercentage ? `-${details.discountPercentage}%` : null}
                      // size={details.size || "Standard"}
                      quantity={1}
                      amount={details.price || 0}
                      currency="MUR"
                      onDelete={() => handleDelete(p.item)}
                      onAddToCart={() => handleAddToCart(p.item)}
                    />
                  )
                })
              )}
            </div>
          </div>
        </div>
      </Grid>
    </>
  )
}