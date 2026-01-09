import React from 'react'

export default function UIButton({text, children, className, onClick}) {
  return (
    <button className={className} onClick={onClick}>
        {children}
      {text}
    </button>
  )
}