import React from 'react'

export default function ErrorLabel({error}){
  return(
    <>
      {error && <p className='error-label text-sm text-red-500'>{error}</p>}
    </>
  )
}