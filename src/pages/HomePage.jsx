import { React, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppNavBar from "../components/navigation/AppNavbar";
import Hero from "../components/layout/Hero";
import ProductTile from "../components/ecommerce/ProductTile";
import Chip from "../components/ecommerce/Chip";
import Grid from '../components/layout/Grid'

export default function HomePage(){

  const {id} = useParams()
  const navigate = useNavigate()
  const apiURL = import.meta.env.VITE_API_URL

  // Holds the AI-generated personalised recommendations
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  // Tracks where the recs came from — for a nice label in the UI
  const [recsSource, setRecsSource] = useState('');

  const [categories, setCategories] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categoryProducts, setCategoryProducts] = useState([])
  const [categoriesError, setCategoriesError] = useState('')


  useEffect(()=>{

    async function fetchHomeData(){
      try {
        const token = localStorage.getItem('fm_token');
        const fetchOptions = {
          headers: { 'Authorization': `Bearer ${token}` }
        };

        // 1. Fetch personalised AI recommendations
        //    The backend decides automatically:
        //      Phase 1 (new user)    → content-based fallback from signup preferences
        //      Phase 2 (active user) → collaborative filtering output from TensorFlow
        try {
          const recRes = await fetch(`${apiURL}/get-recommendations`, fetchOptions);
          if (recRes.ok) {
            const recData = await recRes.json();
            setRecommendedProducts(recData.products || []);
            // Label the section based on which phase served the results
            setRecsSource(recData.source === 'collaborative_filtering'
              ? 'Recommended For You'
              : 'Picked Based on Your Preferences'
            );
          }
        } catch (recErr) {
          console.error('Could not load recommendations:', recErr);
          // Non-blocking — the rest of the page still loads
        }

        // 2. Fetch user categories (no longer needs ID in URL thanks to JWT)
        const catRes = await fetch(`${apiURL}/get-user-categories`, fetchOptions)
        if (!catRes.ok) {
          if (catRes.status === 401 || catRes.status === 403) {
            localStorage.removeItem('fm_token');
            navigate('/login');
            return;
          }
          setCategoriesError('Failed to fetch categories. Please try again.')
          return;
        }
        const fetchedCategories = await catRes.json()
        setCategories(fetchedCategories)

        // 3. Fetch items for each category concurrently
        const productsPromises = fetchedCategories.map(async (category) => {
          const catId = category.CategoryId || category._id; 
          try {
            const prodRes = await fetch(`${apiURL}/get-category-items/${catId}/20`, fetchOptions)
            if (prodRes.ok) {
              const products = await prodRes.json();
              return { categoryName: category.name || "Category", products };
            } else {
              return { categoryName: category.name || "Category", products: [] };
            }
          } catch (err) {
            console.error(`Error fetching items for category ${catId}:`, err);
            return { categoryName: category.name || "Category", products: [] };
          }
        });

        const allCategoryProducts = await Promise.all(productsPromises);
        const filteredCategoryProducts = allCategoryProducts.filter(cp => cp.products && cp.products.length > 0);
        setCategoryProducts(filteredCategoryProducts);

      } catch (err) {
        console.error('Error fetching home data:', err)
        setCategoriesError('Could not reach the server. Please check your connection.')
      }
    }

    fetchHomeData()
  },[apiURL])
  

  return(
    <>
      <AppNavBar />
      <Hero 
        title="Fresh, Local Produce Direct to Your Table" 
        subtitle="Connect with local farmers and find the best organic, seasonal vegetables and fruits near you." 
        ctaPrimary={{ text: 'Start Shopping', href: '/shop' }}
        ctaSecondary={{ text: 'Meet Our Farmers', href: '/farmers' }}
        className="px-0!" 
      />

      {/* ── Recommended For You (AI-powered) ── */}
      {recommendedProducts.length > 0 && (
        <div className="mb-8">
          <div className="mt-12 px-4 sm:px-6 lg:px-12 flex items-center gap-3">
            <h2 className="text-lg font-medium text-pretty text-forest-900 sm:text-xl">
              {recsSource}
            </h2>
            {/* Small label so it's clear which phase is serving results */}
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-lime-100 text-lime-800">
              {recsSource === 'Recommended For You' ? '✦ AI Powered' : '✦ Based on Preferences'}
            </span>
          </div>
          <Grid classes='grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 sm:px-6 lg:px-12 mt-6'>
            {recommendedProducts.map((product) => (
              <ProductTile 
                key={product._id || product.id}
                productId={product._id || product.id}
                productName={product.name || "Product Name"} 
                productImage={product.imageUrl || product.image || "https://dummyimage.com/600x400/1a4d2e/fff"} 
                productPrice={product.price || "100"} 
                productLink={`/product/${product._id || product.id || '#'}`}
              >
                {product.tags?.slice(0, 2).map((tag, idx) => (
                  <Chip key={idx} text={typeof tag === 'string' ? tag : (tag.name || 'Tag')} bgClass={"bg-lime-200"} textClass={"text-lime-900 font-medium"}/>
                ))}
              </ProductTile>
            ))}
          </Grid>
        </div>
      )}

      {/* ── Category Sections ── */}
      {categoryProducts.map((catGroup, index) => {
        if (!catGroup || !catGroup.products) return null;
        
        return (
        <div key={index} className="mb-8">
          <h2 className="mt-12 px-4 sm:px-6 lg:px-12 text-lg font-medium text-pretty text-forest-900 sm:text-xl">
            {catGroup.categoryName}
          </h2>
          <Grid classes='grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 sm:px-6 lg:px-12 mt-6'>
            {catGroup.products.map((product) => (
              <ProductTile 
                key={product._id || product.id || Math.random()}
                productId={product._id || product.id}
                productName={product.name || "Product Name"} 
                productImage={product.imageUrl || product.image || "https://dummyimage.com/600x400/1a4d2e/fff"} 
                productPrice={product.price || "100"} 
                productLink={`/product/${product._id || product.id || '#'}`}
              >
                {product.tags?.slice(0, 2).map((tag, idx) => (
                  <Chip key={idx} text={typeof tag === 'string' ? tag : (tag.name || 'Tag')} bgClass={"bg-lime-200"} textClass={"text-lime-900 font-medium"}/>
                ))}
              </ProductTile>
            ))}
          </Grid>
        </div>
      )})};

    </>
  )
}
