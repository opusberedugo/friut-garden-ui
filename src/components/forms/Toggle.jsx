import React from 'react'

/**
 * Toggle — accessible on/off switch component.
 *
 * Props:
 *   name       {string}   – Input name (for forms & accessibility).
 *   checked    {boolean}  – Controlled toggle state.
 *   onChange   {Function} – Called with the native change event.
 *   leftText   {string}   – Label shown to the left of the switch.
 *   rightText  {string}   – Label shown to the right of the switch.
 *   disabled   {boolean}  – Disables interaction when true.
 *   className  {string}   – Extra wrapper class.
 */
export default function Toggle({
  name,
  checked = false,
  onChange,
  leftText = '',
  rightText = '',
  disabled = false,
  className = '',
}) {
  return (
    <label
      htmlFor={name}
      className={[
        'inline-flex items-center gap-3 select-none',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        className,
      ].join(' ')}
    >
      {/* Left text */}
      {leftText && (
        <span
          className={[
            'text-sm font-medium transition-colors duration-200',
            !checked ? 'text-forest-600' : 'text-gray-400',
          ].join(' ')}
        >
          {leftText}
        </span>
      )}

      {/* Hidden native checkbox */}
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only"
        role="switch"
        aria-checked={checked}
      />

      {/* Track */}
      <span
        aria-hidden="true"
        className={[
          'relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2',
          'transition-all duration-300 ease-in-out',
          'focus-within:ring-2 focus-within:ring-offset-2',
          checked
            ? 'bg-forest-500 border-forest-500 focus-within:ring-forest-400'
            : 'bg-gray-200 border-gray-200 focus-within:ring-lime-400',
        ].join(' ')}
      >
        {/* Thumb */}
        <span
          className={[
            'pointer-events-none inline-block h-4 w-4 self-center rounded-full',
            'shadow-md ring-0',
            'transition-all duration-300 ease-in-out',
            checked
              ? 'translate-x-5 bg-white'
              : 'translate-x-0.5 bg-white',
          ].join(' ')}
        />

        {/* Subtle glow when active */}
        {checked && (
          <span className="absolute inset-0 rounded-full ring-1 ring-forest-400/30 pointer-events-none" />
        )}
      </span>

      {/* Right text */}
      {rightText && (
        <span
          className={[
            'text-sm font-medium transition-colors duration-200',
            checked ? 'text-forest-600' : 'text-gray-400',
          ].join(' ')}
        >
          {rightText}
        </span>
      )}
    </label>
  )
}
