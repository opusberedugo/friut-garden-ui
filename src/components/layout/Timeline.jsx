import React, { useState } from 'react'

import TimelineTrack from './TimelineTrack'
import TimelineSlide from '../ui/TimelineSlide'
import TimelineNav from '../ui/TimelineNav'
import Flex from './Flex'

/**
 * Timeline
 * Full timeline component matching the design: a horizontal track at the top,
 * a large background period label on the left, slide content on the right,
 * and optional prev/next navigation at the bottom left.
 *
 * @param {Array}   steps            - Array of step objects
 * @param {number}  activeIndex      - (controlled) externally managed active index
 * @param {number}  maxAllowedIndex  - Highest index the user may click to (default: all)
 * @param {function} onStepClick     - (controlled) callback when a dot is clicked
 * @param {string}  periodLabel      - Large ghost text on the left
 * @param {boolean} showNav          - Whether to show prev/next navigation (default: true)
 * @param {boolean} showTrackBorder  - Whether to show the bottom border (default: true)
 * @param {string}  className        - Additional classes for the outer container
 */
export default function Timeline({
  steps = [],
  activeIndex: controlledIndex,
  maxAllowedIndex,
  onStepClick: controlledOnStepClick,
  periodLabel = '',
  showNav = true,
  showTrackBorder = true,
  className = ''
}) {
  const [internalIndex, setInternalIndex] = useState(0)

  // Use controlled values if provided, otherwise use internal state
  const isControlled = controlledIndex !== undefined
  const activeIndex = isControlled ? controlledIndex : internalIndex
  const setActiveIndex = isControlled ? controlledOnStepClick : setInternalIndex

  // The highest step index the user is allowed to click
  const maxAllowed = maxAllowedIndex !== undefined ? maxAllowedIndex : steps.length - 1

  function handlePrev() {
    setActiveIndex(Math.max(activeIndex - 1, 0))
  }

  function handleNext() {
    setActiveIndex(Math.min(activeIndex + 1, maxAllowed))
  }

  const activeStep = steps[activeIndex] || {}

  // Determine if any step has slide content worth showing the bottom section for
  const hasAnySlideContent = steps.some(
    (s) => s.roundLabel || s.number || s.title || s.description || s.href
  )

  // Determine if the current active step has content
  const activeStepHasContent =
    activeStep.roundLabel || activeStep.number || activeStep.title ||
    activeStep.description || activeStep.href

  // Determine if the left column (periodLabel / nav) should be visible
  const showLeftColumn = periodLabel || showNav

  return (
    <div className={'relative overflow-hidden ' + className}>

      {/* ── Track ─────────────────────────────────────────────── */}
      <div className={'px-12 pt-10 pb-4 ' + (showTrackBorder ? 'border-b border-stone-200' : '')}>
        <TimelineTrack
          steps={steps}
          activeIndex={activeIndex}
          maxAllowedIndex={maxAllowed}
          onStepClick={setActiveIndex}
        />
      </div>

      {/* ── Bottom section (hidden if no slide content anywhere) ── */}
      {hasAnySlideContent && (
        <Flex className='items-stretch min-h-[260px]'>

          {/* Left column — ghost period label + optional nav */}
          {showLeftColumn && (
            <div className='relative w-2/5 flex flex-col justify-between p-10 border-r border-stone-200'>

              {/* Large ghost heading */}
              {periodLabel && (
                <h2
                  className='text-5xl font-serif font-bold leading-tight select-none'
                  style={{ color: 'rgba(74, 103, 65, 0.12)' }}
                >
                  {periodLabel}
                </h2>
              )}

              {/* Navigation */}
              {showNav && (
                <div className='mt-auto pt-6'>
                  <TimelineNav
                    onPrev={handlePrev}
                    onNext={handleNext}
                    current={activeIndex + 1}
                    total={steps.length}
                    disablePrev={activeIndex === 0}
                    disableNext={activeIndex >= maxAllowed}
                  />
                </div>
              )}
            </div>
          )}

          {/* Right column — slide content (hidden if current step has no content) */}
          {activeStepHasContent && (
            <div className='flex-1 p-10 flex items-center'>
              <TimelineSlide
                key={activeIndex}
                roundLabel={activeStep.roundLabel}
                number={activeStep.number}
                title={activeStep.title}
                description={activeStep.description}
                href={activeStep.href}
              />
            </div>
          )}

        </Flex>
      )}

    </div>
  )
}
