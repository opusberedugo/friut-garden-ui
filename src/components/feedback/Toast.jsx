import React, { useEffect, useState, useRef } from 'react';

// ─── Icons ──────────────────────────────────────────────────────────────────
const Icons = {
  success: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  error: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  warning: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  info: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
};

// ─── Variant config ──────────────────────────────────────────────────────────
const variantConfig = {
  success: { icon: Icons.success, iconBg: 'bg-green-100', iconColor: 'text-green-600', progress: 'bg-green-500' },
  error:   { icon: Icons.error,   iconBg: 'bg-red-100',   iconColor: 'text-red-600',   progress: 'bg-red-500'   },
  warning: { icon: Icons.warning, iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600', progress: 'bg-yellow-400' },
  info:    { icon: Icons.info,    iconBg: 'bg-blue-100',  iconColor: 'text-blue-600',  progress: 'bg-blue-500'  },
};

// ─── Position classes ────────────────────────────────────────────────────────
const positionClasses = {
  'top-right':    'top-4 right-4 items-end',
  'top-left':     'top-4 left-4 items-start',
  'bottom-right': 'bottom-4 right-4 items-end',
  'bottom-left':  'bottom-4 left-4 items-start',
};

/**
 * Toast
 * A lightweight non-blocking notification that auto-dismisses.
 *
 * @param {boolean}  open                            - Controls visibility
 * @param {"success"|"error"|"warning"|"info"} variant - Visual style (default "info")
 * @param {string}   message                         - Notification text
 * @param {number}   duration                        - Auto-dismiss delay in ms (default 4000, 0 = no auto-dismiss)
 * @param {"top-right"|"top-left"|"bottom-right"|"bottom-left"} position - Screen position (default "top-right")
 * @param {Function} onClose                         - Called when toast closes
 * @param {string}   className                       - Extra classes on the toast card
 */
export default function Toast({
  open = false,
  variant = 'info',
  message = '',
  duration = 4000,
  position = 'top-right',
  onClose,
  className = '',
}) {
  const [visible, setVisible] = useState(open);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);

  // Animate in/out
  useEffect(() => {
    if (open) {
      setVisible(true);
      requestAnimationFrame(() => setAnimating(true));

      if (duration > 0) {
        timerRef.current = setTimeout(() => {
          handleClose();
        }, duration);
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

  const cfg = variantConfig[variant] ?? variantConfig.info;
  const pos = positionClasses[position] ?? positionClasses['top-right'];

  // Slide direction based on position
  const slideIn = animating ? 'opacity-100 translate-x-0' : (
    position.includes('right') ? 'opacity-0 translate-x-8' : 'opacity-0 -translate-x-8'
  );

  return (
    <div className={`fixed z-50 flex flex-col gap-2 ${pos}`}>
      <div
        className={[
          'relative w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden',
          'transition-all duration-300',
          slideIn,
          className,
        ].join(' ')}
      >
        {/* Body */}
        <div className="flex items-start gap-3 p-4">
          {/* Icon */}
          <span className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full ${cfg.iconBg} ${cfg.iconColor}`}>
            {cfg.icon}
          </span>

          {/* Message */}
          <p className="flex-1 text-sm text-gray-700 leading-relaxed pt-1">{message}</p>

          {/* Close */}
          <button
            onClick={handleClose}
            className="shrink-0 text-gray-400 hover:text-gray-700 transition-colors"
            aria-label="Dismiss notification"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Auto-dismiss progress bar */}
        {duration > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100">
            <div
              className={`h-full ${cfg.progress} transition-all ease-linear`}
              style={{
                width: animating ? '0%' : '100%',
                transitionDuration: `${duration}ms`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
