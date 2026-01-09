import React from 'react'
export default function NavBar({children}){
    return(
      <nav className='bg-white shadow-md sticky top-0 z-50'>
        {children}
      </nav>
    )
} 