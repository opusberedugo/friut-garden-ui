import React from 'react'
import TimelineDot from '../ui/TimelineDot'
import Flex from './Flex'

/**
 * TimelineTrack
 * The horizontal scrubber bar showing all steps as dots connected by a line.
 * The active dot is labelled with an event name and date above it.
 * Label is always fully visible — clamped away from the edges so it never clips.
 *
 * @param {Array}    steps        - Array of step objects: { label, date, ... }
 * @param {number}   activeIndex  - Index of the currently active step
 * @param {function} onStepClick  - Callback(index) when a dot is clicked
 */
export default function TimelineTrack({ steps = [], activeIndex = 0, onStepClick }) {
  const activeStep = steps[activeIndex] || {}
  const hasLabel = activeStep.label || activeStep.date

  // Calculate label position as a percentage (0–100) then clamp so the
  // label never overflows the left or right edge of the track container.
  const rawPercent = steps.length > 1
    ? (activeIndex / (steps.length - 1)) * 100
    : 50

  return (
    <div className='relative px-8 py-4'>

      {/* Active step label — floats above the active dot, always fully visible */}
      {hasLabel && (
        <div
          className='absolute top-0 text-center transition-all duration-500'
          style={{
            left: `${rawPercent}%`,
            // translateX shifts between -50% (center) toward 0% (left edge)
            // or -100% (right edge) to keep the label fully within the container.
            transform: rawPercent <= 10
              ? 'translateX(0)'           // near left edge — align left
              : rawPercent >= 90
                ? 'translateX(-100%)'    // near right edge — align right
                : 'translateX(-50%)',    // everywhere else — centre
          }}
        >
          {activeStep.label && (
            <p className='text-xs font-semibold text-forest-800 whitespace-nowrap'>
              {activeStep.label}
            </p>
          )}
          {activeStep.date && (
            <p className='text-xs text-forest-600 whitespace-nowrap'>
              {activeStep.date}
            </p>
          )}
        </div>
      )}

      {/* Track line + dots */}
      <div className='relative mt-10'>
        {/* Horizontal line */}
        <div className='absolute top-1/2 left-0 right-0 h-px bg-forest-300 -translate-y-1/2' />

        {/* Dots row */}
        <Flex className='justify-between items-center relative'>
          {steps.map((step, index) => (
            <TimelineDot
              key={index}
              active={index === activeIndex}
              onClick={() => onStepClick?.(index)}
            />
          ))}
        </Flex>
      </div>

    </div>
  )
}
