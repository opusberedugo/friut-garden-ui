import React, { useEffect, useState } from 'react';

// ─── Icons ─────────────────────────────────────────────────────────────────
const Icons = {
  success: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
};

// ─── Variant config ─────────────────────────────────────────────────────────
const variantConfig = {
  success: {
    icon: Icons.success,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    actionBg: 'bg-green-600 hover:bg-green-700',
    border: 'border-green-100',
  },
  error: {
    icon: Icons.error,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    actionBg: 'bg-red-600 hover:bg-red-700',
    border: 'border-red-100',
  },
  warning: {
    icon: Icons.warning,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    actionBg: 'bg-yellow-500 hover:bg-yellow-600',
    border: 'border-yellow-100',
  },
  info: {
    icon: Icons.info,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    actionBg: 'bg-blue-600 hover:bg-blue-700',
    border: 'border-blue-100',
  },
};

/**
 * Alert
 * A modal-style dialog that blocks interaction.
 *
 * @param {boolean}  open         - Controls visibility
 * @param {"success"|"error"|"warning"|"info"} variant - Visual style (default "info")
 * @param {string}   title        - Bold heading text
 * @param {string}   message      - Body description text
 * @param {Array}    actions      - Optional buttons: [{ label, onClick, secondary }]
 *                                   secondary=true renders a ghost-style button
 * @param {Function} onClose      - Called when × is clicked
 * @param {boolean}  backdrop     - Renders a dark overlay behind the alert (default false)
 * @param {boolean}  blur         - Adds backdrop-blur to overlay (requires backdrop=true)
 * @param {string}   className    - Extra classes applied to the alert card
 */
export default function Alert({
  open = false,
  variant = 'info',
  title,
  message,
  actions = [],
  onClose,
  backdrop = false,
  blur = false,
  className = '',
}) {
  const [visible, setVisible] = useState(open);
  const [animating, setAnimating] = useState(false);

  // Animate in when opened
  useEffect(() => {
    if (open) {
      setVisible(true);
      // Small delay so the browser registers the initial opacity-0 class
      requestAnimationFrame(() => setAnimating(true));
    } else {
      setAnimating(false);
      // Wait for the fade-out transition to finish before unmounting
      const t = setTimeout(() => setVisible(false), 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!visible) return null;

  const cfg = variantConfig[variant] ?? variantConfig.info;

  function handleClose() {
    onClose?.();
  }

  return (
    <>
      {/* ── Backdrop ─────────────────────────────────────────── */}
      {backdrop && (
        <div
          onClick={handleClose}
          className={[
            'fixed inset-0 z-40 bg-black transition-opacity duration-250',
            blur ? 'backdrop-blur-sm' : '',
            animating ? 'opacity-40' : 'opacity-0',
          ].join(' ')}
        />
      )}

      {/* ── Alert card ───────────────────────────────────────── */}
      <div
        className={[
          'fixed z-50 inset-0 flex items-center justify-center pointer-events-none',
        ].join(' ')}
      >
        <div
          className={[
            'pointer-events-auto w-full max-w-md bg-white rounded-2xl shadow-xl border',
            cfg.border,
            'p-6 transition-all duration-250',
            animating ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95',
            className,
          ].join(' ')}
        >
          {/* Header row */}
          <div className="flex items-start gap-3">
            {/* Icon bubble */}
            <span className={`shrink-0 flex items-center justify-center w-9 h-9 rounded-full ${cfg.iconBg} ${cfg.iconColor}`}>
              {cfg.icon}
            </span>

            {/* Title + message */}
            <div className="flex-1 min-w-0">
              {title && (
                <p className="font-semibold text-gray-900 text-sm leading-snug">{title}</p>
              )}
              {message && (
                <p className="mt-0.5 text-sm text-gray-600 leading-relaxed">{message}</p>
              )}
            </div>

            {/* Close × */}
            {onClose && (
              <button
                onClick={handleClose}
                className="shrink-0 text-gray-400 hover:text-gray-700 transition-colors ml-2"
                aria-label="Close alert"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          {/* Action buttons */}
          {actions.length > 0 && (
            <div className="mt-5 flex items-center gap-3 justify-end">
              {actions.map((action, i) =>
                action.secondary ? (
                  <button
                    key={i}
                    onClick={action.onClick}
                    className="px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {action.label}
                  </button>
                ) : (
                  <button
                    key={i}
                    onClick={action.onClick}
                    className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${cfg.actionBg}`}
                  >
                    {action.label}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
