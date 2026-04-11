import React from 'react';
import Image from '../utility/Image';

export default function WishlistItem({
  image,
  title,
  subtitle,
  badge,
  size,
  quantity,
  amount,
  onDelete,
  onAddToCart,
  currency = "$"
}) {
  return (
    <div className="grid grid-cols-12 gap-4 items-center py-6 border-b border-gray-100 bg-white">
      {/* Product Image and Details (Cols 1-5) */}
      <div className="col-span-12 md:col-span-5 lg:col-span-5 flex items-center gap-4">
        <div className="w-20 h-20 shrink-0 bg-transparent flex items-center justify-center relative overflow-hidden">
          <Image src={image} alt={title} imgClass="max-w-full max-h-full object-contain drop-shadow-sm mix-blend-multiply" />
        </div>
        <div className="flex flex-col items-start">
          <h4 className="font-semibold text-gray-900 text-[15px]">{title}</h4>
          <p className="text-gray-500 text-[11px] mt-0.5 leading-tight">{subtitle}</p>
          {badge && (
            <span className="bg-gray-200 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-sm mt-1">
              {badge}
            </span>
          )}
        </div>
      </div>

      {/* Quantity (Cols 6-7) */}
      <div className="hidden lg:flex lg:col-span-2 justify-center items-center gap-1">
        <span className="text-sm font-semibold text-gray-800">{quantity || 1}</span>
      </div>

      {/* Amount (Cols 8-9) */}
      <div className="col-span-4 md:col-span-2 lg:col-span-2 flex justify-center items-center">
        <span className="font-bold text-gray-900 text-sm whitespace-nowrap">{currency}{Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>

      {/* Add To Cart (Cols 10-11) */}
      <div className="col-span-6 md:col-span-3 lg:col-span-2 flex justify-center items-center">
        <button onClick={onAddToCart} className="bg-[#1877F2] hover:bg-blue-600 text-white text-[13px] font-semibold py-2 px-5 rounded-[4px] whitespace-nowrap transition-colors shadow-sm">
          Add to Cart
        </button>
      </div>

      {/* Delete (Col 12) */}
      <div className="col-span-2 md:col-span-2 lg:col-span-1 flex justify-center items-center">
        <button onClick={onDelete} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
