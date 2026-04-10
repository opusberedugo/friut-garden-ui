import React from 'react';
import Image from '../utility/Image';

export default function CartItem({ image, title, subtitle, children }) {
  return (
    <div className="flex flex-col sm:flex-row items-center border border-gray-100 rounded-[1.5rem] p-4 gap-4 w-full shadow-sm">
      <div className="flex items-center gap-4 flex-1 w-full">
        <div className="w-20 h-20 bg-[#F4F5F9] rounded-2xl flex items-center justify-center p-3 shrink-0">
          <Image src={image} alt={title} imgClass="max-w-full max-h-full object-contain" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 text-sm md:text-base">{title}</h4>
          {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center justify-between flex-1 w-full sm:w-auto">
        {children}
      </div>
    </div>
  );
}
