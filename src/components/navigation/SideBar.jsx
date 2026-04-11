import React, { useState } from 'react';

/**
 * SideBar component that acts as a container for sidebar items.
 * On mobile devices, it collapses into a drawer toggleable by a button.
 *
 * @param {ReactNode} children - The content of the sidebar (links, dividers, branding)
 * @param {string} className - Optional tailwind classes to override default styling
 */
export default function SideBar({ children, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="lg:hidden p-4 bg-white border-b border-gray-100 flex items-center justify-between col-span-1">
        <span className="font-semibold text-gray-700">Account Navigation</span>
        <button onClick={() => setIsOpen(true)} className="p-2 border border-gray-200 rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100 transition">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div 
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity lg:hidden ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} 
        onClick={() => setIsOpen(false)}
      ></div>

      <aside className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out bg-slate-50 w-64 h-full min-h-screen border-r border-slate-200 overflow-y-auto py-6
        lg:relative lg:translate-x-0 lg:flex lg:flex-col lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${className}
      `.trim()}>
        <div className="px-6 pb-4 lg:hidden flex justify-between items-center text-forest-600 font-bold border-b border-slate-200 mb-4">
          <span>Navigation</span>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-200 rounded-full transition">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
             </svg>
          </button>
        </div>
        
        {children}
      </aside>
    </>
  );
}
