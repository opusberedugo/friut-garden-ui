import React from 'react'

export default function Checkbox({text,name,checked,onChange}) {
  return(
    <label className="flex items-center space-x-2 cursor-pointer">
      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900" name={name} checked={checked} onChange={onChange}/>
      <span className="text-gray-700">{text}</span>
    </label>
  )
}