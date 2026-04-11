import React, { useState, useEffect } from "react";

import Flex from "../layout/Flex";
import Image from "../utility/Image";
import NavBar from "./NavigationBar";

export default function AppNavBar(){
  const [searchTerm, setSearchTerm] = useState("");
  const [navCategories, setNavCategories] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    function get4RandomUnique(arr) {
      const shuffled = [...arr];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[shuffled[j]]] = [shuffled[j], shuffled[i]];
      }
      return shuffled.slice(0, 4);
    }

    async function fetchNavCategories() {
      try {
        const token = localStorage.getItem('fm_token');
        let fetchedCategories = [];

        if (token) {
           const catRes = await fetch(`${apiURL}/get-user-categories`, { headers: { 'Authorization': `Bearer ${token}` } });
           if (catRes.ok) {
              const data = await catRes.json();
              if (data && data.length > 0) {
                 fetchedCategories = data.map(c => ({ id: c.CategoryId || c._id || c.id, name: c.name }));
              }
           }
        }

        if (!fetchedCategories || fetchedCategories.length === 0) {
           const fallbackRes = await fetch(`${apiURL}/get-categories`);
           if (fallbackRes.ok) {
              const data = await fallbackRes.json();
              fetchedCategories = data.map(c => ({ id: c._id || c.id, name: c.name }));
           }
        }

        if (fetchedCategories && fetchedCategories.length > 0) {
           setNavCategories(get4RandomUnique(fetchedCategories));
        }
      } catch (err) {
        console.error('Navbar category fetch error:', err);
      }
    }
    fetchNavCategories();
  }, [apiURL]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      window.location.href = `/search?query=${encodeURIComponent(searchTerm.trim())}`;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return(
    <NavBar>
        <div className='mx-auto px-4 sm:px-6 lg:px-10 py-4'>
          <Flex className='justify-between items-center'>
            <a href="/home" className='block w-24 hover:scale-110 transition-transform duration-300'>
              <Image src="/logo.png" alt="Logo" imgClass="w-full" />
            </a>

            <Flex className={""}>
                 {/* Desktop Search Bar */}
                 <div className="hidden md:flex flex-1 max-w-md mx-12 lg:mx-16">
                     <div className="relative w-full">
                         <input 
                             type="text" 
                             placeholder="Product Search" 
                             value={searchTerm}
                             onChange={(e) => setSearchTerm(e.target.value)}
                             onKeyDown={handleKeyDown}
                             className="w-full min-w-[400px] px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-forest-500 transition text-sm"/>
                             
                         <button onClick={handleSearch} className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition">
                             <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                 <circle cx="11" cy="11" r="8"/>
                                 <path d="m21 21-4.35-4.35"/>
                             </svg>
                         </button>
                     </div>
                 </div>

                 <Flex className="items-center gap-5">
                   <a href="/profile">
                     <svg className="w-6 h-6 text-gray-600 hover:text-gray-900 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                       <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                       <circle cx="12" cy="7" r="4"/>
                     </svg>
                   </a>
                   
                   {/* Mobile Menu Button */}
                   <button className="md:hidden p-1 text-gray-600 focus:outline-none" onClick={() => setIsDrawerOpen(true)}>
                     <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                   </button>
                 </Flex>
            </Flex>
          </Flex>

          {/* Desktop Categories */}
          <Flex className={"hidden md:flex py-2 border-t border-gray-100 items-center justify-center gap-x-8 mt-4"}>
            {navCategories.map((category) => (
              <a key={category.id} href={`/category/${category.id}`} className="block text-sm font-medium text-gray-600 hover:text-forest-600 transition whitespace-nowrap">
                {category.name}
              </a>
            ))}
          </Flex>
        </div>

        {/* Mobile Navigation Drawer Overlay */}
        <div 
          className={`fixed inset-0 bg-black/50 z-[60] transition-opacity md:hidden ${isDrawerOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} 
          onClick={() => setIsDrawerOpen(false)}
        ></div>
        
        {/* Mobile Drawer */}
        <div className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}>
           <div className="flex items-center justify-between p-5 border-b border-gray-100">
             <span className="font-bold text-forest-700 text-lg">Menu</span>
             <button onClick={() => setIsDrawerOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
           </div>
           
           <div className="p-5 border-b border-gray-100">
             <div className="relative w-full">
                 <input 
                     type="text" 
                     placeholder="Search products..." 
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     onKeyDown={handleKeyDown}
                     className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-forest-500 transition text-sm pr-10"/>
                 <button onClick={handleSearch} className="absolute right-3 top-1/2 -translate-y-1/2">
                     <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                         <circle cx="11" cy="11" r="8"/>
                         <path d="m21 21-4.35-4.35"/>
                     </svg>
                 </button>
             </div>
           </div>

           <div className="flex flex-col py-3 overflow-y-auto flex-1">
             <span className="px-5 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Top Categories</span>
             {navCategories.map((category) => (
               <a key={category.id} href={`/category/${category.id}`} className="block px-5 py-3.5 text-[15px] font-medium text-gray-700 hover:bg-forest-50 border-b border-gray-50">
                 {category.name}
               </a>
             ))}
           </div>
           
           <div className="p-5 border-t border-gray-100">
              <a href="/profile" className="flex items-center justify-center w-full py-3 bg-forest-600 text-white rounded-xl font-medium shadow-sm hover:bg-forest-700 transition">
                 View Profile
              </a>
           </div>
        </div>
    </NavBar>
  )
}