import React from 'react'
import Hero from '../components/layout/Hero'
import NavBar from '../components/navigation/NavigationBar'
import Flex from '../components/layout/Flex'
import Image from '../components/utility/Image'
import Grid from '../components/layout/Grid'
import ProductTile from '../components/ecommerce/ProductTile'
import Chip from '../components/ecommerce/Chip'
import LandingPageNavBar from '../components/navigation/LandingPageNavBar'

export default function LandingPage(){
  return(
    <>
      <LandingPageNavBar />

      <Hero title={"Demo Title"} 
        subtitle={"Demo Subtitle"}
        announcement={{text:"Demo Announcement", href:"https://google.com"}}
        ctaPrimary={{text:"Demo Primary CTA"}}
        ctaSecondary={{text:"Demo Secondary CTA"}}
        className="mt-8"
      />

      <Grid classes='grid-cols-4 gap-4 px-12 mt-12'>
        <ProductTile productName="Product Name" productImage="https://dummyimage.com/600x400/1a4d2e/fff" productPrice="100" productDescription="Product Description" productLink="https://google.com">
          <Chip text="Fertilizer"  bgClass={"bg-lime-200"} textClass={"text-lime-900 font-medium"}/>
          <Chip text="Organic"  bgClass={"bg-lime-200"} textClass={"text-lime-900 font-medium"}/>
        </ProductTile>
        
      </Grid>
    </>
  )
}