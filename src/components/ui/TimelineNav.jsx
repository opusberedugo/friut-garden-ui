import React from 'react'
import Flex from '../layout/Flex'

/**
 * TimelineNav
 * Prev / Next navigation buttons + step counter display.
 *
 * @param {function} onPrev      - Callback for previous button
 * @param {function} onNext      - Callback for next button
 * @param {number}   current     - Current step (1-indexed for display)
 * @param {number}   total       - Total number of steps
 * @param {boolean}  disablePrev - Whether the prev button should be disabled
 * @param {boolean}  disableNext - Whether the next button should be disabled
 */
export default function TimelineNav({ onPrev, onNext, current, total, disablePrev, disableNext }) {
  return (
    <Flex className='items-center gap-4'>

      {/* Prev Button */}
      <button
        onClick={onPrev}
        disabled={disablePrev}
        aria-label='Previous step'
        className={
          'w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ' +
          (disablePrev
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-mango-400 text-white hover:bg-mango-500 shadow-sm hover:shadow-md')
        }
      >
        {/* Left arrow */}
        <svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
          <path d='M15 18l-6-6 6-6' />
        </svg>
      </button>

      {/* Counter */}
      <span className='text-sm font-medium text-forest-700 min-w-[50px] text-center'>
        {current} of {total}
      </span>

      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={disableNext}
        aria-label='Next step'
        className={
          'w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ' +
          (disableNext
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-mango-400 text-white hover:bg-mango-500 shadow-sm hover:shadow-md')
        }
      >
        {/* Right arrow */}
        <svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
          <path d='M9 18l6-6-6-6' />
        </svg>
      </button>

    </Flex>
  )
}
