import React from 'react';

export default function CartCard({ children, className = '' }) {
  return (
    <div className={`p-6 md:p-8 rounded-[2rem] ${className}`}>
      {children}
    </div>
  );
}
