import {React, useState, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppNavBar from '../components/navigation/AppNavbar'
import Image from '../components/utility/Image'
import UIButton from '../components/ui/Button'
import Flex from '../components/layout/Flex'
import Grid from '../components/layout/Grid'
import Container from '../components/layout/Container'

export default function ProductPage(){
    const {productId} = useParams()
    const navigate = useNavigate()
    const apiURL = import.meta.env.VITE_API_URL

    const [product, setProduct] = useState([])
    const [productError, setProductError] = useState('')

    useEffect(()=>{
      async function fetchProduct(){
          try {
              const token = localStorage.getItem('fm_token')
              const fetchOptions = {
                  headers: { 'Authorization': `Bearer ${token}` }
              }
              const res = await fetch(`${apiURL}/get-product/${productId}`, fetchOptions)
              if (!res.ok) {
                  setProductError('Failed to fetch product. Please try again.')
                  return;
              }
              const fetchedProduct = await res.json()
              setProduct(fetchedProduct)
              console.log("Product: ", fetchedProduct)
          } catch (err) {
              console.error('Error fetching product:', err)
              setProductError('Could not reach the server. Please check your connection.')
          }
      }
      fetchProduct()
  },[productId, apiURL])

    return(
        <>
          <AppNavBar />

          <Container className="px-12 mt-12">
            <Grid className="grid-cols-2 gap-4">
              <Image src={"https://dummyimage.com/600x400/1a4d2e/fff"} alt={product.name} imgClass="w-full block" />
              <Flex className="flex-col gap-4">
                <p className='max-w-l text-5xl font-semibold tracking-tight text-balance text-lime-700 sm:text-7xl'>{product.name}</p>
                <p className='mt-4 text-xl text-gray-600'>{product.price} MUR</p>
                <p className='mt-4 text-xl text-gray-600'>{product.description}</p>
                <Flex className={"gap-2 my-2"}>
                    <UIButton text="Add to Cart" onClick={() => {}} className={"bg-lime-500 px-4 py-2 rounded-full "} />
                    <UIButton text="" onClick={() => {}} className={"bg-lime-500 p-2 px-2.5 rounded-full "}>
                        <svg className='w-5 h-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 8.81056L13.6352 6.48845C14.2721 5.58412 15.3179 5 16.5 5C18.433 5 20 6.567 20 8.5C20 11.3788 18.0407 14.1215 15.643 16.3358C14.4877 17.4027 13.3237 18.2603 12.4451 18.8521C12.2861 18.9592 12.1371 19.0571 11.9999 19.1456C11.8627 19.0571 11.7137 18.9592 11.5547 18.8521C10.6761 18.2604 9.51216 17.4028 8.35685 16.3358C5.95926 14.1216 4 11.3788 4 8.5C4 6.567 5.567 5 7.5 5C8.68209 5 9.72794 5.58412 10.3648 6.48845L12 8.81056ZM10.5557 3.92626C9.68172 3.3412 8.63071 3 7.5 3C4.46243 3 2 5.46243 2 8.5C2 16 11.9999 21.4852 11.9999 21.4852C11.9999 21.4852 22 16 22 8.5C22 5.46243 19.5376 3 16.5 3C15.3693 3 14.3183 3.3412 13.4443 3.92626C12.8805 4.3037 12.3903 4.78263 12 5.33692C11.6097 4.78263 11.1195 4.3037 10.5557 3.92626Z"></path>
                        </svg>
                    </UIButton>
                </Flex>
              </Flex>
            </Grid>
          </Container>
        </>
    )
}