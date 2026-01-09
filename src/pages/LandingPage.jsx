import React from 'react'
import Hero from '../components/layout/Hero'
import NavBar from '../components/navigation/NavigationBar'
import Flex from '../components/layout/Flex'
import Image from '../components/utility/Image'
import Grid from '../components/layout/Grid'
import ProductTile from '../components/ecommerce/ProductTile'
import Chip from '../components/ecommerce/Chip'

export default function LandingPage(){
  return(
    <>
      <NavBar>
        <div className='mx-auto px-6 lg:px-10 py-5'>
          <Flex className='justify-between items-center'>
            <a href="" className='block w-24 hover:scale-110 transition-transform duration-300'>
              <Image src="logo.png" alt="" imgClass="w-full" />
            </a>

            <Flex className={""}>
              {/* Search Bar (Hidden on mobile) */}
                <div class="hidden md:flex flex-1 max-w-md mx-12 lg:mx-16">
                    <div class="relative w-full">
                        <input 
                            type="text" 
                            placeholder="Product Search" 
                            class="w-full min-w-[400px] px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-isagenix-teal transition text-sm"/>
                            
                        <button class="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition">
                            <svg class="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="11" cy="11" r="8"/>
                                <path d="m21 21-4.35-4.35"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <Flex className="items-center gap-5">
                  {/* User Link */}
                  <a href="#">
                    <svg className="w-6 h-6 text-isagenix-gray" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </a>
                  
                  {/* User Link */}
                  <a href="#">
                    <svg className="w-6 h-6 text-isagenix-gray" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="9" cy="21" r="1"/>
                      <circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                  </a>
                </Flex>
            </Flex>
          </Flex>

          <Flex className={"py-2 border-t border-gray-100 items-center gap-x-4"}>
            <a href="" className="block px-4 text-sm transition whitespace-nowrap">Home</a>
            <a href="" className="block px-4 text-sm transition whitespace-nowrap">About</a>
            <a href="" className="block px-4 text-sm transition whitespace-nowrap">About</a>
            <a href="" className="block px-4 text-sm transition whitespace-nowrap">Contact</a>
            <a href="" className="ml-auto px-6 py-2.5 border-2 border-forest-500 text-forest-500 font-semibold text-sm rounded hover:bg-forest-500 hover:text-white transition whitespace-nowrap">Blog</a>
          </Flex>
        </div>
      </NavBar>

      <Hero title={"Demo Title"} 
        subtitle={"Demo Subtitle"}
        announcement={{text:"Demo Announcement", href:"https://google.com"}}
        ctaPrimary={{text:"Demo Primary CTA"}}
        ctaSecondary={{text:"Demo Secondary CTA"}}
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