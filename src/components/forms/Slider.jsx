import React, { useId } from 'react'

/**
 * Slider — styled range input for forms.
 *
 * Props:
 *   name        {string}   – Input name (for forms & accessibility).
 *   label       {string}   – Field label shown above the track.
 *   required    {boolean}  – Shows a red asterisk next to the label.
 *   value       {number}   – Controlled current value.
 *   onChange    {Function} – Called with the native change event.
 *   min         {number}   – Minimum value (default 0).
 *   max         {number}   – Maximum value (default 100).
 *   step        {number}   – Step increment (default 1).
 *   leftText    {string}   – Label shown at the left end of the track.
 *   rightText   {string}   – Label shown at the right end of the track.
 *   showValue   {boolean}  – Shows a live value bubble above the thumb.
 *   shadow      {boolean}  – Adds a lime glow shadow under the track.
 *   unit        {string}   – Unit suffix appended to the bubble value (e.g. '%', 'kg').
 *   disabled    {boolean}  – Disables interaction when true.
 *   error       {string}   – External error message.
 *   className   {string}   – Extra wrapper class.
 */
export default function Slider({
  name,
  label = '',
  required = false,
  value = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  leftText = '',
  rightText = '',
  showValue = true,
  shadow = false,
  unit = '',
  disabled = false,
  error = '',
  className = '',
}) {
  const uid = useId()
  const inputId = name || uid

  // Percentage of fill (0 → 100) used to colour the left side of the track
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className={`slider-field ${className}`}>

      {/* Label row */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-gray-700 font-medium mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Live value bubble */}
      {showValue && (
        <div className="flex justify-end mb-1">
          <span
            className={[
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
              'bg-forest-500 text-white',
              'transition-all duration-200',
            ].join(' ')}
          >
            {value}{unit}
          </span>
        </div>
      )}

      {/* Track wrapper — py padding gives the CSS thumb vertical room;
           the inner rail div is the bordered gray background. */}
      <div
        className={[
          'relative w-full flex items-center',
          shadow ? 'shadow-lime' : '',
        ].join(' ')}
      >
        {/* Unfilled rail — gray with border so the empty portion is visible */}
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gray-100 border border-gray-300" />
        {/* Filled-track overlay */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 h-full rounded-full bg-forest-500 pointer-events-none transition-all duration-150"
          style={{ width: `${pct}%` }}
        />

        <input
          type="range"
          id={inputId}
          name={name}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          disabled={disabled}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          className={[
            'slider-input',
            'relative w-full cursor-pointer',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-400 focus-visible:ring-offset-2',
            disabled ? 'opacity-50 cursor-not-allowed' : '',
          ].join(' ')}
          style={{ background: 'transparent' }}
        />
      </div>

      {/* Min / Max boundary labels */}
      {(leftText || rightText) && (
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-400">{leftText}</span>
          <span className="text-xs text-gray-400">{rightText}</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-500 flex items-center gap-1">
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
          {error}
        </p>
      )}
    </div>
  )
}
