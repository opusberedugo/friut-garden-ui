import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Timeline from "../components/layout/Timeline";
import Flex from "../components/layout/Flex";
import Image from "../components/utility/Image";
import Button from "../components/ui/Button";
import Grid from "../components/layout/Grid";
import Toast from "../components/feedback/Toast";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    // Ping telemetry handler silently when screen loads
    const logIntent = async () => {
      try {
        const token = localStorage.getItem('fm_token');
        if(token) {
          await fetch(`${apiURL}/log-checkout-intent`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
          });
        }
      } catch (err) {
        console.error("Telemetry pipeline error: ", err);
      }
    };
    logIntent();
  }, [apiURL]);

  const [currentStep, setCurrentStep] = useState(0);
  const [toast, setToast] = useState({ open: false, message: '', variant: 'success' });
  const [isProcessing, setIsProcessing] = useState(false);

  // Form State
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const [fullName, setFullName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [postal, setPostal] = useState("");

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!cardNumber || !cardExp || !cardCvc) {
        setToast({ open: true, message: 'Please fill out all card details.', variant: 'error' });
        return;
    }
    // Simulate processing payment validity and sliding
    setCurrentStep(1);
  };

  const handleDeliverySubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !streetAddress || !city) {
        setToast({ open: true, message: 'Please enter your full delivery address.', variant: 'error' });
        return;
    }

    setIsProcessing(true);
    setToast({ open: true, message: 'Processing your order securely...', variant: 'info' });

    // Connect to secure /place-order sequence
    try {
      const token = localStorage.getItem('fm_token');
      if (token) {
         const res = await fetch(`${apiURL}/place-order`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ fullName, streetAddress, city, postal })
         });
         
         if(!res.ok) throw new Error("Order failed");

         // Explicitly trigger AI training from the frontend after a successful order.
         // This is a fire-and-forget call — we don't await it and don't block the user.
         // The backend also triggers this automatically, but calling it here ensures
         // training happens even if the server-side trigger has an issue.
         fetch(`${apiURL}/train-recommendations`, {
           method: 'POST',
           headers: { 'Authorization': `Bearer ${token}` }
         }).catch(err => console.warn('[AI] Training request error:', err));
      }

      setIsProcessing(false);
      setToast({ open: true, message: 'Order created successfully! Redirecting...', variant: 'success' });
      setTimeout(() => navigate("/profile/orders"), 2000);
    } catch (err) {
      setIsProcessing(false);
      setToast({ open: true, message: 'Something went wrong processing your order. Try again.', variant: 'error' });
    }
  };


  return (
    <>
      <Toast 
        open={toast.open} 
        message={toast.message} 
        variant={toast.variant} 
        onClose={() => setToast({ ...toast, open: false })} 
      />
      <div className="bg-[#f6f9fc] min-h-screen py-10 px-4 sm:px-10">
        
        {/* Header / Brand */}
        <Flex className="flex items-center justify-between max-w-4xl mx-auto xl:px-0 px-8 mb-10">
          <button type="button" onClick={() => navigate(-1)} className="text-sm text-gray-600 hover:text-gray-900 focus:outline-none transition-colors" aria-label="Go Back">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.57813 12.4981C3.5777 12.6905 3.65086 12.8831 3.79761 13.0299L9.7936 19.0301C10.0864 19.3231 10.5613 19.3233 10.8543 19.0305C11.1473 18.7377 11.1474 18.2629 10.8546 17.9699L6.13418 13.2461L20.3295 13.2461C20.7437 13.2461 21.0795 12.9103 21.0795 12.4961C21.0795 12.0819 20.7437 11.7461 20.3295 11.7461L6.14168 11.7461L10.8546 7.03016C11.1474 6.73718 11.1473 6.2623 10.8543 5.9695C10.5613 5.6767 10.0864 5.67685 9.79362 5.96984L3.84392 11.9233C3.68134 12.0609 3.57812 12.2664 3.57812 12.4961L3.57813 12.4981Z" fill="currentColor"/>
            </svg>
          </button>
          <div className="font-bold text-xl text-forest-900">Farmers Marketplace</div>
        </Flex>

        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-[0_15px_35px_rgba(50,50,93,0.1),0_5px_15px_rgba(0,0,0,0.07)] p-8 sm:p-12 overflow-hidden">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Secure Checkout</h1>
            
            <Timeline
                showTrackBorder={false}
                showNav={false}
                activeIndex={currentStep}
                onStepClick={setCurrentStep}
                maxAllowedIndex={currentStep}
                steps={[
                { label: 'Payment Info' },
                { label: 'Delivery Address' }
                ]}
            />

            {/* Slide container */}
            <div className="mt-10 overflow-hidden w-full relative">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentStep * 100}%)` }}
                >

                    {/* ── Step 0: Stripe Payment ── */}
                    <div className="w-full flex-shrink-0 px-2">
                        <form onSubmit={handlePaymentSubmit}>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h2>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name on card</label>
                                <input 
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0058ff] focus:border-[#0058ff] text-gray-800 placeholder-gray-400 transition-colors"
                                    placeholder="Jane Doe"
                                    value={cardName}
                                    onChange={e => setCardName(e.target.value)}
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Card information</label>
                                {/* Formatted Stripe Card Layout */}
                                <div className="border border-gray-300 rounded-md shadow-sm overflow-hidden bg-white focus-within:ring-1 focus-within:ring-[#0058ff] focus-within:border-[#0058ff] transition-shadow duration-200">
                                    <div className="px-3 py-3 border-b border-gray-300 relative flex items-center">
                                        <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                        <input 
                                            type="text" 
                                            placeholder="Card number" 
                                            className="w-full focus:outline-none text-gray-800 placeholder-gray-400 bg-transparent text-[15px]" 
                                            value={cardNumber}
                                            onChange={e => setCardNumber(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex bg-white">
                                        <div className="w-1/2 px-3 py-3 border-r border-gray-300">
                                            <input 
                                                type="text" 
                                                placeholder="MM / YY" 
                                                className="w-full focus:outline-none text-gray-800 placeholder-gray-400 bg-transparent text-[15px]" 
                                                value={cardExp}
                                                onChange={e => setCardExp(e.target.value)}
                                            />
                                        </div>
                                        <div className="w-1/2 px-3 py-3">
                                            <input 
                                                type="text" 
                                                placeholder="CVC" 
                                                className="w-full focus:outline-none text-gray-800 placeholder-gray-400 bg-transparent text-[15px]" 
                                                value={cardCvc}
                                                onChange={e => setCardCvc(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit"
                                className="w-full bg-[#1877F2] hover:bg-blue-600 text-white font-semibold py-3.5 px-4 rounded-md shadow-[0_4px_6px_rgba(50,50,93,0.11),0_1px_3px_rgba(0,0,0,0.08)] transition-all flex items-center justify-center gap-2 mt-4"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                                Authenticate Payment
                            </button>
                        </form>
                    </div>

                    {/* ── Step 1: Delivery Address ── */}
                    <div className="w-full flex-shrink-0 px-2">
                        <form onSubmit={handleDeliverySubmit}>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Shipping Destination</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input 
                                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-400 focus:border-gray-400 text-gray-800 placeholder-gray-400 transition-colors"
                                        placeholder="Jane Doe"
                                        value={fullName}
                                        onChange={e => setFullName(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                    <input 
                                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-400 focus:border-gray-400 text-gray-800 placeholder-gray-400 transition-colors"
                                        placeholder="123 Main St"
                                        value={streetAddress}
                                        onChange={e => setStreetAddress(e.target.value)}
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-2/3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                        <input 
                                            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-400 focus:border-gray-400 text-gray-800 placeholder-gray-400 transition-colors"
                                            placeholder="Grand Port"
                                            value={city}
                                            onChange={e => setCity(e.target.value)}
                                        />
                                    </div>
                                    <div className="w-1/3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                        <input 
                                            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-400 focus:border-gray-400 text-gray-800 placeholder-gray-400 transition-colors"
                                            placeholder="12345"
                                            value={postal}
                                            onChange={e => setPostal(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button 
                                    type="button"
                                    onClick={() => setCurrentStep(0)}
                                    disabled={isProcessing}
                                    className="w-1/3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-semibold py-3.5 px-4 rounded-md transition-colors"
                                >
                                    Back
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-2/3 bg-forest-600 hover:bg-forest-700 text-white font-semibold py-3.5 px-4 rounded-md shadow-md transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? "Processing..." : "Complete Order"}
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>

        </div>
      </div>
    </>
  );
}
