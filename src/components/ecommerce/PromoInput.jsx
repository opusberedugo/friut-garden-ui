import React from 'react';
import UIButton from '../ui/Button';

export default function PromoInput({ placeholder = "Type here...", buttonText = "Apply", onApply }) {
  return (
    <div className="relative border border-gray-200 rounded-full p-1.5 flex items-center bg-transparent mt-4 mb-6">
      <input 
        type="text" 
        placeholder={placeholder} 
        className="flex-1 bg-transparent px-4 py-2 outline-none text-sm text-gray-800 placeholder-gray-400"
      />
      <UIButton 
        text={buttonText} 
        onClick={onApply}
        className="bg-[#0B0F19] text-white px-8 py-2.5 rounded-full text-sm font-medium hover:bg-gray-900 transition-colors"
      />
    </div>
  );
}
