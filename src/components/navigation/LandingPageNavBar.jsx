import React from "react";

import Flex from "../layout/Flex";
import NavBar from "./NavigationBar";

import Image from "../utility/Image";

export default function LandingPageNavBar(){
  return (
  <NavBar>
        <div className='mx-auto px-6 lg:px-10 py-5'>
          <Flex className='justify-between items-center'>
            <a href="" className='block w-24 hover:scale-110 transition-transform duration-300'>
              <Image src="logo.png" alt="" imgClass="w-full" />
            </a>

            <Flex className={""}>
            

                <Flex className="items-center gap-5">
                  <a href="" className="block px-4 text-sm transition whitespace-nowrap">Home</a>
                  <a href="" className="block px-4 text-sm transition whitespace-nowrap">About</a>
                  <a href="" className="block px-4 text-sm transition whitespace-nowrap">Contact</a>
                  <a href="/signup" className="ml-auto px-6 py-2.5 border-2 border-forest-500 text-forest-500 font-semibold text-sm rounded hover:bg-forest-500 hover:text-white transition whitespace-nowrap">Get Started</a>
                </Flex>
            </Flex>
          </Flex>

        </div>
      </NavBar>
  )
}