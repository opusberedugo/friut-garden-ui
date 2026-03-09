import React, { useRef, useState } from 'react'
import ErrorLabel from './ErrorLabel'

/**
 * OTPInput
 * A row of individual single-character input boxes for OTP / verification codes.
 * Matches the FormField styling conventions used across the project.
 *
 * Behaviour:
 *  - Typing a digit auto-advances focus to the next box
 *  - Backspace clears the current box and moves focus back
 *  - Pasting a string fills boxes left-to-right from the focused position
 *  - Only numeric input is accepted (non-digits are silently rejected)
 *
 * @param {number}   length      - Number of OTP boxes to render (default: 6)
 * @param {string}   label       - Label shown above the OTP row (hidden if empty)
 * @param {boolean}  required    - Shows a red asterisk next to the label
 * @param {string}   error       - Error message shown below the OTP row
 * @param {function} onChange    - Called with the full OTP string on every keystroke
 * @param {string}   className   - Extra classes on the outer wrapper div
 */
export default function OTPInput({
  length = 6,
  label = '',
  required = false,
  error = '',
  onChange,
  className = '',
}) {
  const [values, setValues] = useState(Array(length).fill(''))
  const inputs = useRef([])

  // Notify parent of the full OTP string
  function notify(updated) {
    onChange?.(updated.join(''))
  }

  function handleKeyDown(e, index) {
    if (e.key === 'Backspace') {
      e.preventDefault()
      const updated = [...values]

      if (updated[index]) {
        // Clear the current box first
        updated[index] = ''
        setValues(updated)
        notify(updated)
      } else if (index > 0) {
        // Already empty — move back and clear the previous box
        updated[index - 1] = ''
        setValues(updated)
        notify(updated)
        inputs.current[index - 1]?.focus()
      }
    }

    // Allow left/right arrow navigation
    if (e.key === 'ArrowLeft' && index > 0) inputs.current[index - 1]?.focus()
    if (e.key === 'ArrowRight' && index < length - 1) inputs.current[index + 1]?.focus()
  }

  function handleChange(e, index) {
    const raw = e.target.value

    // Strip non-digits
    const digit = raw.replace(/\D/g, '').slice(-1)
    if (!digit) return

    const updated = [...values]
    updated[index] = digit
    setValues(updated)
    notify(updated)

    // Advance focus
    if (index < length - 1) {
      inputs.current[index + 1]?.focus()
    }
  }

  function handlePaste(e, index) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '')
    if (!pasted) return

    const updated = [...values]
    let focusTarget = index

    for (let i = 0; i < pasted.length && index + i < length; i++) {
      updated[index + i] = pasted[i]
      focusTarget = index + i
    }

    setValues(updated)
    notify(updated)

    // Focus the box after the last filled one (or the last box)
    const nextFocus = Math.min(focusTarget + 1, length - 1)
    inputs.current[nextFocus]?.focus()
  }

  function handleFocus(e) {
    // Select existing content so typing immediately replaces it
    e.target.select()
  }

  const baseBoxClass =
    'w-12 h-14 text-center text-xl font-semibold bg-white border rounded-lg ' +
    'focus:outline-none focus:ring-2 focus:border-transparent transition-colors caret-transparent '

  const errorBoxClass = 'border-red-500 focus:ring-red-500'
  const normalBoxClass = 'border-gray-300 focus:ring-gray-900'

  return (
    <div className={`form-field ${className}`}>

      {/* Label */}
      {label && (
        <label className='block text-gray-700 font-medium mb-3'>
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
        </label>
      )}

      {/* OTP boxes row */}
      <div className='flex gap-3'>
        {values.map((val, index) => (
          <input
            key={index}
            ref={(el) => (inputs.current[index] = el)}
            id={`otp-box-${index}`}
            type='text'
            inputMode='numeric'
            maxLength={1}
            value={val}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={(e) => handlePaste(e, index)}
            onFocus={handleFocus}
            className={baseBoxClass + (error ? errorBoxClass : normalBoxClass)}
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            aria-label={`OTP digit ${index + 1} of ${length}`}
          />
        ))}
      </div>

      {/* Error message */}
      <ErrorLabel error={error} />

    </div>
  )
}
