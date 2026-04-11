import {React, useState, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppNavBar from '../components/navigation/AppNavbar'
import Image from '../components/utility/Image'
import UIButton from '../components/ui/Button'
import Flex from '../components/layout/Flex'
import Grid from '../components/layout/Grid'
import Container from '../components/layout/Container'
import Toast from '../components/feedback/Toast'

export default function ProductPage(){
    const {productId} = useParams()
    const navigate = useNavigate()
    const apiURL = import.meta.env.VITE_API_URL

    const [product, setProduct] = useState([])
    const [productError, setProductError] = useState('')
    const [reviews, setReviews] = useState([])
    const [canReview, setCanReview] = useState(false)

    const [rating, setRating] = useState(5)
    const [reviewTitle, setReviewTitle] = useState('')
    const [reviewBody, setReviewBody] = useState('')

    useEffect(()=>{
      async function fetchProductData(){
          try {
              const token = localStorage.getItem('fm_token')
              const fetchOptions = {
                  headers: { 'Authorization': `Bearer ${token}` }
              }
              const res = await fetch(`${apiURL}/get-product/${productId}`, fetchOptions)
              if (!res.ok) {
                  if (res.status === 401 || res.status === 403) {
                      localStorage.removeItem('fm_token');
                      navigate('/login');
                      return;
                  }
                  setProductError('Failed to fetch product. Please try again.')
                  return;
              }
              const fetchedProduct = await res.json()
              setProduct(fetchedProduct)

              // Fetch Reviews
              const revRes = await fetch(`${apiURL}/get-reviews/${productId}`)
              if(revRes.ok) setReviews(await revRes.json())

              if(token){
                  // Check explicit review capability
                  const intentRes = await fetch(`${apiURL}/check-purchase-intent/${productId}`, fetchOptions)
                  if(intentRes.ok) {
                      const intentData = await intentRes.json()
                      setCanReview(intentData.hasIntent)
                  }
              }
          } catch (err) {
              console.error('Error fetching product:', err)
          }
      }
      fetchProductData()
  },[productId, apiURL])

    const [toast, setToast] = useState({ open: false, message: '', variant: 'success' });
    const [inCart, setInCart] = useState(false);
    const [inWishlist, setInWishlist] = useState(false);

    const handleAddToCart = async (e) => {
        e.preventDefault();
        if (inCart) return; // Prevent duplicate additions if already tracked locally
        
        try {
            const token = localStorage.getItem('fm_token');
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
        if (inWishlist) return; // Prevent duplicate additions
        
        try {
            const token = localStorage.getItem('fm_token');
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

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('fm_token');
            const res = await fetch(`${apiURL}/add-review`, {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    itemId: productId,
                    rating: parseFloat(rating),
                    title: reviewTitle,
                    body: reviewBody
                }),
            });
            if (res.ok) {
                setToast({ open: true, message: 'Review successfully submitted to AI Matrix!', variant: 'success' });
                setReviewTitle('');
                setReviewBody('');
                const newRevRes = await fetch(`${apiURL}/get-reviews/${productId}`);
                if(newRevRes.ok) setReviews(await newRevRes.json());
            } else {
                setToast({ open: true, message: 'Failed to submit review.', variant: 'error' });
            }
        } catch (err) {
            console.error('Error adding review:', err);
            setToast({ open: true, message: 'Failed to submit review.', variant: 'error' });
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
          <AppNavBar />

          <Container className="px-12 mt-12">
            <Grid className="grid-cols-2 gap-4">
              <Image src={"https://dummyimage.com/600x400/1a4d2e/fff"} alt={product.name} imgClass="w-full block" />
              <Flex className="flex-col gap-4">
                <p className='max-w-l text-5xl font-semibold tracking-tight text-balance text-lime-700 sm:text-7xl'>{product.name}</p>
                <p className='mt-4 text-xl text-gray-600'>{product.price} MUR</p>
                <p className='mt-4 text-xl text-gray-600'>{product.description}</p>
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
                </Flex>
              </Grid>

              {/* ── Reviews Block ── */}
              <div className="mt-20 w-full xl:w-[90%] mx-auto mb-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Verified Reviews</h2>
                
                {/* Form (only shown if canReview is true) */}
                {canReview && (
                  <div className="mb-10 bg-gray-50 border border-gray-200 p-6 rounded-xl shadow-sm">
                     <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave an Explicit Review</h3>
                     <form onSubmit={handleReviewSubmit} className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                         <select value={rating} onChange={e=>setRating(e.target.value)} className="w-40 bg-white border border-gray-300 rounded-md p-2.5 focus:ring-[#436FE2] focus:border-[#436FE2]">
                           <option value="5">5 ★★★★★</option>
                           <option value="4">4 ★★★★☆</option>
                           <option value="3">3 ★★★☆☆</option>
                           <option value="2">2 ★★☆☆☆</option>
                           <option value="1">1 ★☆☆☆☆</option>
                         </select>
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                         <input value={reviewTitle} onChange={e=>setReviewTitle(e.target.value)} required className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-[#436FE2] focus:border-[#436FE2]" placeholder="Summarize your thoughts" />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Review Body</label>
                         <textarea value={reviewBody} onChange={e=>setReviewBody(e.target.value)} required rows="4" className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-[#436FE2] focus:border-[#436FE2]" placeholder="Tell us about the product..."></textarea>
                       </div>
                       <button type="submit" className="bg-[#436FE2] hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-md shadow-sm transition-colors">Submit Review</button>
                     </form>
                  </div>
                )}

                {/* Display existing reviews */}
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map(rev => (
                      <div key={rev._id} className="border border-gray-200 rounded-[12px] p-6 bg-white flex flex-col">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="text-[15px] font-semibold text-gray-900 capitalize">{rev.firstName} {rev.lastName}</div>
                            <div className="text-xs text-gray-500 mt-1">{new Date(rev.createdAt).toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year:'numeric'})}</div>
                          </div>
                          <div className="flex items-center space-x-4 text-gray-400">
                             <span className="flex items-center space-x-1 text-sm"><svg className="w-4 h-4 cursor-pointer hover:text-blue-500 transition-colors" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" /></svg><span>{rev.likes || 453}</span></span>
                             <span className="flex items-center space-x-1 text-sm"><svg className="w-4 h-4 cursor-pointer hover:text-red-500 transition-colors" fill="currentColor" viewBox="0 0 20 20"><path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" /></svg><span>{rev.dislikes || 583}</span></span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 w-fit bg-[#436FE2] text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm mb-3">
                          <span>{parseFloat(rev.rating).toFixed(1)}</span><span>★</span>
                        </div>
                        <h4 className="text-[16px] font-bold text-gray-900 leading-tight tracking-tight">{rev.title}</h4>
                        <p className="text-[14px] text-gray-500 mt-2 leading-relaxed">{rev.body}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic mt-6">No explicit ratings mapped yet. Be the first to train the network!</p>
                )}
              </div>
            </Container>
          </>
      )
  }