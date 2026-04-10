import React from 'react';

/**
 * SidebarDivider component to visually separate groups of sidebar items.
 * 
 * @param {string} className - Optional extra classes to override default spacing/styling
 */
export default function SidebarDivider({ className = '' }) {
  return (
    <div className={`my-4 border-t border-slate-200 ${className}`.trim()} />
  );
}
