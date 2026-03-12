import React, { useEffect, useState, useRef } from 'react';

/**
 * Snackbar
 * A slim bottom-bar notification, typically used for brief confirmations
 * or undo-style actions.
 *
 * @param {boolean}  open      - Controls visibility
 * @param {string}   message   - Text to display
 * @param {Object}   action    - Optional action button: { label: string, onClick: function }
 * @param {number}   duration  - Auto-dismiss delay in ms (default 4000, 0 = no auto-dismiss)
 * @param {Function} onClose   - Called when snackbar closes
 * @param {string}   className - Extra classes on the snackbar
 */
export default function Snackbar({
  open = false,
  message = '',
  action = null,
  duration = 4000,
  onClose,
  className = '',
}) {
  const [visible, setVisible] = useState(open);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (open) {
      setVisible(true);
      requestAnimationFrame(() => setAnimating(true));

      if (duration > 0) {
        timerRef.current = setTimeout(() => handleClose(), duration);
      }
    } else {
      handleClose();
    }
    return () => clearTimeout(timerRef.current);
  }, [open]);

  function handleClose() {
    clearTimeout(timerRef.current);
    setAnimating(false);
    setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, 300);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div
        className={[
          'flex items-center gap-4 px-5 py-3 bg-gray-900 text-white rounded-xl shadow-xl',
          'transition-all duration-300',
          animating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
          className,
        ].join(' ')}
      >
        {/* Message */}
        <p className="text-sm font-medium whitespace-nowrap">{message}</p>

        {/* Optional action button */}
        {action && (
          <button
            onClick={() => { action.onClick?.(); handleClose(); }}
            className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors shrink-0"
          >
            {action.label}
          </button>
        )}

        {/* Dismiss × */}
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
