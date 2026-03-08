import React from 'react'

/**
 * TimelineSlide
 * The content panel for a single timeline step.
 * Every field is individually guarded — if a field is empty it is not rendered.
 * If ALL fields are empty the component returns null (display none).
 *
 * @param {string} roundLabel  - Small rotated side label (e.g. "Round One")
 * @param {string} number      - Step number string (e.g. "01")
 * @param {string} title       - Step heading
 * @param {string} description - Step body text
 * @param {string} href        - "Continue Reading" link URL
 */
export default function TimelineSlide({ roundLabel, number, title, description, href }) {
  // If absolutely nothing is provided, render nothing
  const isEmpty = !roundLabel && !number && !title && !description && !href
  if (isEmpty) return null

  return (
    <div className='flex gap-6 items-start'>

      {/* Rotated side label — hidden if not provided */}
      {roundLabel && (
        <div className='flex-shrink-0 flex items-center justify-center'>
          <span
            className='text-xs text-forest-400 tracking-widest uppercase whitespace-nowrap'
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            {roundLabel}
          </span>
        </div>
      )}

      {/* Main content block */}
      <div>

        {/* Title row — hidden if neither number nor title is provided */}
        {(number || title) && (
          <h2 className='text-2xl font-semibold text-forest-900 mb-3'>
            {number && <span className='mr-2'>{number}</span>}
            {title && <span>{title}</span>}
          </h2>
        )}

        {/* Description — hidden if not provided */}
        {description && (
          <p className='text-sm text-gray-500 leading-relaxed max-w-xs mb-4'>
            {description}
          </p>
        )}

        {/* Continue Reading link — hidden if href not provided */}
        {href && (
          <a
            href={href}
            className='text-sm text-forest-500 underline underline-offset-4 hover:text-forest-700 transition-colors'
          >
            Continue Reading
          </a>
        )}

      </div>

    </div>
  )
}
