import {React, useState, useEffect} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppNavBar from "../components/navigation/AppNavbar";
import Container from "../components/layout/Container";
import Grid from "../components/layout/Grid";
import ProductTile from "../components/ecommerce/ProductTile";
import Chip from "../components/ecommerce/Chip";

export default function SearchPage(){
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const apiURL = import.meta.env.VITE_API_URL;
    const query = new URLSearchParams(window.location.search).get("query");

    useEffect(() => {
      async function fetchProducts() {
        try {
          const token = localStorage.getItem("fm_token");
          const fetchOptions = {
            headers: { "Authorization": `Bearer ${token}` }
          };
          const res = await fetch(`${apiURL}/search?query=${decodeURIComponent(query)}`, fetchOptions);
          if (!res.ok) {
            if (res.status === 401 || res.status === 403) {
              localStorage.removeItem("fm_token");
              navigate("/login");
              return;
            }
            setError("Failed to fetch products. Please try again.");
            return;
          }
          const fetchedProducts = await res.json();
          setProducts(fetchedProducts);
          console.log("Products: ", fetchedProducts);
        } catch (err) {
          console.error("Error fetching products:", err);
          setError("Could not reach the server. Please check your connection.");
        }
      }
      fetchProducts();
    }, [query, apiURL]);
    return(
      <>
        <AppNavBar />
        <Container className="px-12 mt-12">
          <h2 className="mt-12 px-12 text-lg font-medium text-pretty text-forest-900 sm:text-xl">{`Search Results for "${query}" (${products.length})`}</h2>
          <Grid className="grid-cols-4 gap-4 px-12 mt-6">
            {products.map((product) => (
              <ProductTile key={product._id}
                productId={product._id}
                productName={product.name}
                productImage={product.imageUrl || product.image || "https://dummyimage.com/600x400/1a4d2e/fff"} 
                productPrice={product.price}
                productDescription={product.description} 
                productLink={`/product/${product._id}`}
            >
                {product.tags?.slice(0, 2).map((tag, idx) => (
                  <Chip key={idx} text={typeof tag === 'string' ? tag : (tag.name || 'Tag')} bgClass={"bg-lime-200"} textClass={"text-lime-900 font-medium"}/>
                ))}
              </ProductTile>
            ))}
          </Grid>
        </Container>
      </>
    )
}
