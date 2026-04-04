import React, { useState } from 'react'

/**
 * MultiSelect — pill-style multiselect form component.
 *
 * Props:
 *   label      {string}   – Field label shown above the options.
 *   options    {Array}    – List of option objects: [{ value, label, emoji? }]
 *   value      {Array}    – Controlled selected values array.
 *   onChange   {Function} – Called with the updated selected array.
 *   min        {number}   – Minimum number of required selections (default 0).
 *   max        {number}   – Maximum number of allowed selections (default Infinity).
 *   required   {boolean}  – Shows a red asterisk next to the label.
 *   error      {string}   – External error message (e.g. from form validation).
 *   name       {string}   – Field name (for accessibility).
 *   className  {string}   – Extra wrapper class.
 */
export default function MultiSelect({
  label,
  options = [],
  value = [],
  onChange,
  min = 0,
  max = Infinity,
  required = false,
  error = '',
  name = 'multiselect',
  className = '',
}) {
  const [touched, setTouched] = useState(false)

  function isSelected(optionValue) {
    return value.includes(optionValue)
  }

  function handleToggle(optionValue) {
    setTouched(true)
    if (isSelected(optionValue)) {
      // Deselect
      onChange(value.filter((v) => v !== optionValue))
    } else {
      // Select — guard against max
      if (value.length < max) {
        onChange([...value, optionValue])
      }
    }
  }

  // Derive internal validation message
  let internalError = ''
  if (touched) {
    if (min > 0 && value.length < min) {
      internalError = `Please select at least ${min} option${min > 1 ? 's' : ''}.`
    } else if (value.length > max) {
      internalError = `You can select at most ${max} option${max > 1 ? 's' : ''}.`
    }
  }

  const displayError = error || internalError

  return (
    <div className={`multiselect-field ${className}`} role="group" aria-labelledby={`${name}-label`}>

      {/* Label */}
      <label htmlFor={name} className='block text-gray-700 font-medium mb-2'>{label} {required && <span className='text-red-500'>*</span>}</label>

      {/* Hint row */}
      {(min > 0 || max < Infinity) && (
        <p className="text-sm text-gray-400 mb-3">
          {min > 0 && max < Infinity && `Select ${min}–${max}`}
          {min > 0 && max === Infinity && `Select at least ${min}`}
          {min === 0 && max < Infinity && `Select up to ${max}`}
        </p>
      )}

      {/* Option Pills */}
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const selected = isSelected(option.value)
          const reachedMax = !selected && value.length >= max

          return (
            <button
              key={option.value}
              type="button"
              id={`${name}-${option.value}`}
              onClick={() => !reachedMax && handleToggle(option.value)}
              aria-pressed={selected}
              disabled={reachedMax}
              className={[
                'flex items-center gap-2 px-4 py-2 rounded-md border-2 font-medium text-sm',
                'transition-all duration-200 ease-in-out',
                'focus:outline-none focus:ring-2 focus:ring-offset-2',
                selected
                  ? 'bg-forest-500 border-forest-500 text-white shadow-forest focus:ring-forest-400'
                  : reachedMax
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-forest-400 hover:bg-lime-50 hover:text-forest-600 focus:ring-lime-300 cursor-pointer',
              ].join(' ')}
            >
              {option.emoji && (
                <span className="text-base leading-none">{option.emoji}</span>
              )}
              <span>{option.label}</span>

              {/* Checkmark badge when selected */}
              {selected && (
                <span className="w-4 h-4 flex items-center justify-center rounded-full bg-white/20 ml-1">
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    viewBox="0 0 10 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.5 5.5L3.5 7.5L8.5 2.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Selection counter */}
      <p className="mt-2 text-xs text-gray-400">
        {value.length} selected
        {max < Infinity && ` / ${max} max`}
      </p>

      {/* Error message */}
      {displayError && (
        <p
          role="alert"
          className="mt-2 text-sm text-red-500 flex items-center gap-1"
        >
          <svg
            className="w-3.5 h-3.5 flex-shrink-0"
            viewBox="0 0 16 16"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1ZM7 5a1 1 0 1 1 2 0v3a1 1 0 1 1-2 0V5Zm1 6.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z"
            />
          </svg>
          {displayError}
        </p>
      )}
    </div>
  )
}
