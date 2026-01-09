import React from 'react'

export default function Chip({text, bgClass, textClass}){
    return(
      <div className={'rounded-md py-0.5 px-2.5 text-sm transition-all shadow-sm ' + bgClass + ' ' + textClass}>
        {text}
      </div>
    )
}