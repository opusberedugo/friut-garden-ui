import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppNavBar from "../navigation/AppNavbar";
import Grid from "./Grid";
import SideBar from "../navigation/SideBar";
import SideBarLink from "../navigation/SideBarLink";
import SidebarDivider from "../navigation/SidebarDivider";
import FormField from "../forms/FormField";
import FormButton from "../forms/Button";
import Alert from "../feedback/Alert";

export default function SellerLayout({ children }) {
  const navigate = useNavigate();
  const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const [status, setStatus] = useState("loading"); // loading, none, pending, approved
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [alertState, setAlertState] = useState({ open: false, variant: 'info', title: '', message: '' });

  const [businessName, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

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

  useEffect(() => {
    const checkSellerStatus = async () => {
      try {
        const token = localStorage.getItem('fm_token');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await fetch(`${apiURL}/get-seller-status`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setStatus(data.status); // approved, pending, none
        } else {
          const errData = await res.json().catch(() => ({}));
          console.error(`[SellerLayout] /get-seller-status failed with HTTP ${res.status}:`, errData);
          setStatus("none");
        }
      } catch (err) {
        console.error("[SellerLayout] Network error fetching seller status:", err);
        setStatus("none");
      }
    };
    checkSellerStatus();
  }, [apiURL, navigate]);

  const handleSubmitVerification = async (e) => {
    e.preventDefault();
    if (!businessName.trim() || !description.trim() || !location.trim()) {
      setAlertState({ open: true, variant: "error", title: "Incomplete Form", message: "Please fill in all requested business details including location." });
      return;
    }

    setLoadingSubmit(true);
    try {
      const token = localStorage.getItem('fm_token');
      const res = await fetch(`${apiURL}/submit-seller-verification`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ businessName, description, location })
      });

      if (res.ok) {
        setStatus("pending");
      } else {
        setAlertState({ open: true, variant: "error", title: "Submission Failed", message: "Could not submit form. Try again." });
      }
    } catch (err) {
      console.error(err);
      setAlertState({ open: true, variant: "error", title: "Network Error", message: "Failed to communicate with server." });
    } finally {
      setLoadingSubmit(false);
    }
  };

  const renderContent = () => {
    if (status === "loading") {
      return (
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-gray-500 font-medium animate-pulse">Checking credentials...</p>
        </div>
      );
    }

    if (status === "pending") {
      return (
        <div className="max-w-2xl px-4 md:px-12 pt-8">
          <div className="bg-orange-50 border border-orange-200 rounded-[2rem] p-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Under Review</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We have successfully received your seller verification request. Quality assurance is manually reviewing your business profile. This process typically resolves within 24-48 business hours.
            </p>
            <p className="text-orange-600 font-medium">Please check back later.</p>
          </div>
        </div>
      );
    }

    if (status === "none") {
      return (
        <div className="max-w-2xl px-4 md:px-12 pt-8">
          <h2 className="text-[28px] font-bold text-gray-900 mb-2">Become a Seller</h2>
          <p className="text-gray-600 mb-8">Offer your best farm products directly to the community. Please provide your business identity to unlock the sales suite.</p>
          
          <Alert 
            open={alertState.open} 
            variant={alertState.variant} 
            title={alertState.title} 
            message={alertState.message} 
            onClose={() => setAlertState({ ...alertState, open: false })} 
          />

          <form onSubmit={handleSubmitVerification} className="mt-8 bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm flex flex-col gap-6">
            <FormField 
              name="businessName"
              label="Business or Farm Name"
              type="text"
              placeholder="e.g. Green Valley Organics"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />
            
            <FormField 
              name="location"
              label="Business Location"
              type="text"
              placeholder="e.g. Flic en Flac, Mauritius"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
            
            <div className="form-field">
              <label className='block text-gray-700 font-medium mb-2'>Business Description <span className='text-red-500'>*</span></label>
              <textarea 
                rows="4"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors resize-none"
                placeholder="What exactly do you farm or sell? Describe your operational transparency..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <FormButton 
              className="bg-forest-500 hover:bg-forest-600 transition-colors mt-2" 
              text={loadingSubmit ? "Submitting Application..." : "Submit Verification Application"} 
              disabled={loadingSubmit}
            />
          </form>
        </div>
      );
    }

    // Approved: render the actual nested portal page
    return children;
  };

  return (
    <>
      <AppNavBar />
      <Grid className="grid-cols-1 md:grid-cols-5 min-h-screen">
        <SideBar className="col-span-1 border-r border-gray-100">
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Cart" href="/profile" >Cart</SideBarLink>
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Wishlist" href="/profile/wishlist" >Wishlist</SideBarLink>
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Preferences" href="/profile/preferences" >Preferences</SideBarLink>
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Orders" href="/profile/orders" >Orders</SideBarLink>

          <SidebarDivider />

          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Sales Dashboard" href="/profile/sales/dashboard">Sales Dashboard</SideBarLink>
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Products" href="/profile/sales/products">My Products</SideBarLink>
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Orders" href="/profile/sales/orders">My Orders</SideBarLink>
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Reviews" href="/profile/sales/reviews">My Reviews</SideBarLink>

          <SidebarDivider />

          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Profile" href="/profile" >Profile Settings</SideBarLink>
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Settings" href="/settings" >Account Settings</SideBarLink>
          <SideBarLink className="text-red-500 bg-transparent hover:bg-transparent hover:text-red-600" text="Log Out" onClick={handleLogout} >Log Out</SideBarLink>
        </SideBar>

        <Grid className="col-span-1 md:col-span-4 w-full mt-8 pb-32">
          {renderContent()}
        </Grid>
      </Grid>
    </>
  );
}
