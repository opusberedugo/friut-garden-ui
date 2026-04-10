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

  const [recommendedProducts, setRecommendedProducts] = useState([]);
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

        // 1. Fetch user categories (no longer needs ID in URL thanks to JWT)
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
        console.log("Categories: ", fetchedCategories)

        // 2. Fetch items for each category concurrently
        const productsPromises = fetchedCategories.map(async (category) => {
          // The backend returns CategoryId (from user's recent modifications and as per standard)
          const catId = category.CategoryId || category._id; 
          try {
            const prodRes = await fetch(`${apiURL}/get-category-items/${catId}/20`, fetchOptions)
            if (prodRes.ok) {
              const products = await prodRes.json();
              return { categoryName: category.name || "Category", products };
            } else {
              console.error(`Failed to fetch items for category ${catId}`);
              return { categoryName: category.name || "Category", products: [] };
            }
          } catch (err) {
            console.error(`Error fetching items for category ${catId}:`, err);
            return { categoryName: category.name || "Category", products: [] };
          }
        });

        // Resolve all requests
        const allCategoryProducts = await Promise.all(productsPromises);
        
        // 3. Remove arrays where no items were fetched
        const filteredCategoryProducts = allCategoryProducts.filter(cp => cp.products && cp.products.length > 0);
        
        // Update the state with the combined filtered results
        setCategoryProducts(filteredCategoryProducts);
        console.log("Filtered Category Products: ", filteredCategoryProducts)

      } catch (err) {
        console.error('Error fetching home data:', err)
        setCategoriesError('Could not reach the server. Please check your connection.')
      }
    }

    // We no longer require the 'id' parameter to run fetchHomeData
    fetchHomeData()
  },[apiURL])
  

  return(
    <>
      <AppNavBar />
      {/* <LandingPageNavBar /> */}
      <Hero 
        title="Fresh, Local Produce Direct to Your Table" 
        subtitle="Connect with local farmers and find the best organic, seasonal vegetables and fruits near you." 
        ctaPrimary={{ text: 'Start Shopping', href: '/shop' }}
        ctaSecondary={{ text: 'Meet Our Farmers', href: '/farmers' }}
        className="px-0!" 
      />

      {categoryProducts.map((catGroup, index) => {
        // Safeguard to prevent crashes if the state shape is temporarily mismatched during HMR
        if (!catGroup || !catGroup.products) return null;
        
        return (
        <div key={index} className="mb-8">
          <h2 className="mt-12 px-12 text-lg font-medium text-pretty text-forest-900 sm:text-xl">
            {catGroup.categoryName}
          </h2>
          <Grid classes='grid-cols-4 gap-4 px-12 mt-6'>
            {catGroup.products.map((product) => (
              <ProductTile 
                key={product._id || product.id || Math.random()}
                productId={product._id || product.id}
                productName={product.name || "Product Name"} 
                productImage={product.imageUrl || product.image || "https://dummyimage.com/600x400/1a4d2e/fff"} 
                productPrice={product.price || "100"} 
                // productDescription={product.description || "Product Description"} 
                productLink={`/product/${product._id || product.id || '#'}`}
              >
                {product.tags?.slice(0, 2).map((tag, idx) => (
                  <Chip key={idx} text={typeof tag === 'string' ? tag : (tag.name || 'Tag')} bgClass={"bg-lime-200"} textClass={"text-lime-900 font-medium"}/>
                ))}
              </ProductTile>
            ))}
          </Grid>
        </div>
      )})}

    </>
  )
}