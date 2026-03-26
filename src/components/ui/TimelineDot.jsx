import React from 'react'

/**
 * TimelineDot
 * A single dot marker on the timeline track.
 * 
 * @param {boolean}  active    - Whether this dot is the currently selected step
 * @param {boolean}  disabled  - Whether this dot is locked (future step)
 * @param {function} onClick   - Callback when dot is clicked
 */
export default function TimelineDot({ active, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={
        'w-4 h-4 rounded-full border-2 transition-all duration-300 ' +
        (disabled
          ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50'
          : active
            ? 'bg-forest-500 border-forest-500 scale-125 cursor-pointer'
            : 'bg-white border-forest-700 hover:border-forest-500 cursor-pointer')
      }
      aria-label={disabled ? 'Locked timeline step' : active ? 'Current timeline step' : 'Go to timeline step'}
    />
  )
}
