import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * SidebarLink component for navigation items inside the SideBar.
 * Supports icons, text, active states, and custom styling.
 * 
 * @param {string} to - The route path to link to
 * @param {ReactNode} icon - Optional icon element to display before the text
 * @param {ReactNode} children - The text or content of the link
 * @param {string} className - Optional extra classes for the link container
 * @param {string} activeClassName - Optional override classes for when the link is active
 */
export default function SidebarLink({ 
  to, 
  href,
  icon, 
  children, 
  className = '', 
  activeClassName = '',
  onClick
}) {
  const defaultBaseClasses = "flex items-center px-4 py-3 mx-4 rounded-md transition-colors text-sm font-medium";
  const defaultInactiveClasses = "text-slate-500 hover:bg-slate-100/50 hover:text-slate-900";
  const defaultActiveClasses = "bg-blue-50 text-blue-600"; // Based on the reference image

  const targetPath = to || href || '#';

  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <NavLink 
      to={targetPath}
      onClick={handleClick}
      className={({ isActive }) => 
        onClick ? `${defaultBaseClasses} ${defaultInactiveClasses} cursor-pointer ${className}`.trim() : `${defaultBaseClasses} ${isActive ? (activeClassName || defaultActiveClasses) : defaultInactiveClasses} ${className}`.trim()
      }
    >
      {icon && (
        <span className="mr-3 flex items-center justify-center text-lg">
          {icon}
        </span>
      )}
      <span className="flex-1">{children}</span>
    </NavLink>
  );
}
