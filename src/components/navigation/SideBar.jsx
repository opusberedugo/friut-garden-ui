import React from 'react';

/**
 * SideBar component that acts as a container for sidebar items.
 * Built for maximum customizability using the children prop.
 *
 * @param {ReactNode} children - The content of the sidebar (links, dividers, branding)
 * @param {string} className - Optional tailwind classes to override default styling
 */
export default function SideBar({ children, className = '' }) {
  return (
    <aside className={`flex flex-col w-64 h-full min-h-screen bg-slate-50 border-r border-slate-200 overflow-y-auto py-6 ${className}`.trim()}>
      {children}
    </aside>
  );
}
