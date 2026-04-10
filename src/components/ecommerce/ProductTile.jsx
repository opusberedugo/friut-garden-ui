import React, { useState } from 'react'
import Image from '../utility/Image'
import UIButton from '../ui/Button'
import Flex from '../layout/Flex'
import { useNavigate } from 'react-router-dom'
import Toast from '../feedback/Toast'

export default function ProductTile({productId, productName, productImage, productPrice, productDescription, productLink, children}){
    const navigate = useNavigate();
    const [toast, setToast] = useState({ open: false, message: '', variant: 'success' });
    const [inCart, setInCart] = useState(false);
    const [inWishlist, setInWishlist] = useState(false);

    const handleTileClick = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('fm_token');
            const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            
            await fetch(`${apiURL}/interactions`, {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    action: 'click',
                    productId: productId, 
                }),
            });
        } catch (error) {
            console.error('Error sending interaction request:', error);
        } finally {
            if (productLink && productLink.startsWith('http')) {
                window.location.href = productLink;
            } else {
                navigate(productLink || '#');
            }
        }
    };

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (inCart) return;
        
        try {
            const token = localStorage.getItem('fm_token');
            const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            
            const res = await fetch(`${apiURL}/add-to-cart`, {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    itemId: productId,
                    quantity: 1
                }),
            });
            if (res.ok) {
                setInCart(true);
                setToast({ open: true, message: 'Added to cart!', variant: 'success' });
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            setToast({ open: true, message: 'Failed to add to cart.', variant: 'error' });
        }
    };

    const handleToggleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (inWishlist) return;
        
        try {
            const token = localStorage.getItem('fm_token');
            const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            
            const res = await fetch(`${apiURL}/add-to-wishlist`, {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    itemId: productId, 
                }),
            });
            if (res.ok) {
                setInWishlist(true);
                setToast({ open: true, message: 'Added to wishlist!', variant: 'success' });
            }
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            setToast({ open: true, message: 'Failed to add to wishlist.', variant: 'error' });
        }
    };

    return(
      <>
      <Toast 
        open={toast.open} 
        message={toast.message} 
        variant={toast.variant} 
        onClose={() => setToast({ ...toast, open: false })} 
      />
      <a href={productLink} onClick={handleTileClick} className="block relative">
        <Image src={productImage} alt={productName} imgClass="w-full block" />
        <Flex className={"gap-2 mt-2"}>
          {children}
        </Flex>
        <p>{productName}</p>
        <p>{productPrice} MUR</p>
        <Flex className={"gap-2 my-2"}>
          <UIButton 
            text={inCart ? "In Cart 🛒" : "Add to Cart"} 
            onClick={handleAddToCart} 
            className={`px-4 py-2 rounded-full cursor-pointer z-10 transition-colors ${inCart ? 'bg-forest-600 text-white' : 'bg-lime-500'}`} 
          />
          <UIButton 
            text="" 
            onClick={handleToggleWishlist} 
            className={`p-2 px-2.5 rounded-full cursor-pointer z-10 transition-colors ${inWishlist ? 'bg-red-100 text-red-500' : 'bg-lime-500'}`}
          >
            <svg className='w-5 h-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8.81056L13.6352 6.48845C14.2721 5.58412 15.3179 5 16.5 5C18.433 5 20 6.567 20 8.5C20 11.3788 18.0407 14.1215 15.643 16.3358C14.4877 17.4027 13.3237 18.2603 12.4451 18.8521C12.2861 18.9592 12.1371 19.0571 11.9999 19.1456C11.8627 19.0571 11.7137 18.9592 11.5547 18.8521C10.6761 18.2604 9.51216 17.4028 8.35685 16.3358C5.95926 14.1216 4 11.3788 4 8.5C4 6.567 5.567 5 7.5 5C8.68209 5 9.72794 5.58412 10.3648 6.48845L12 8.81056ZM10.5557 3.92626C9.68172 3.3412 8.63071 3 7.5 3C4.46243 3 2 5.46243 2 8.5C2 16 11.9999 21.4852 11.9999 21.4852C11.9999 21.4852 22 16 22 8.5C22 5.46243 19.5376 3 16.5 3C15.3693 3 14.3183 3.3412 13.4443 3.92626C12.8805 4.3037 12.3903 4.78263 12 5.33692C11.6097 4.78263 11.1195 4.3037 10.5557 3.92626Z"></path>
            </svg>
          </UIButton>
        </Flex>
      </a>
      </>
    )
}