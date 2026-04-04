import React from 'react'

export default function FormLabel({ label, name, required }) {
  return (
    <label htmlFor={name} className='block text-gray-700 font-medium mb-2'>{label} {required && <span className='text-red-500'>*</span>}</label>
  );
}