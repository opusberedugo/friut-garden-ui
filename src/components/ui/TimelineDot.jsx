import React from 'react'

/**
 * TimelineDot
 * A single dot marker on the timeline track.
 * 
 * @param {boolean} active   - Whether this dot is the currently selected step
 * @param {function} onClick - Callback when dot is clicked
 */
export default function TimelineDot({ active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={
        'w-4 h-4 rounded-full border-2 transition-all duration-300 cursor-pointer ' +
        (active
          ? 'bg-forest-500 border-forest-500 scale-125'
          : 'bg-white border-forest-700 hover:border-forest-500')
      }
      aria-label={active ? 'Current timeline step' : 'Go to timeline step'}
    />
  )
}
