import React from 'react';

export default function SummaryRow({ label, value, isTotal = false }) {
  return (
    <div className={`flex justify-between items-center mb-3 ${isTotal ? 'mt-4 border-t border-gray-100 pt-5 text-gray-900' : 'text-gray-400'}`}>
      <span className={isTotal ? 'text-[15px] font-bold' : 'text-[15px] font-medium'}>{label}</span>
      <span className={isTotal ? 'text-[17px] font-bold' : 'text-[14px] text-gray-400'}>{value}</span>
    </div>
  );
}
