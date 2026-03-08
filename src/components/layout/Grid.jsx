import React from "react";

/**
 * Grid
 * @param {string} classes   - Tailwind grid utility classes (legacy prop)
 * @param {string} className - Tailwind grid utility classes (preferred, consistent with other components)
 * @param {ReactNode} children
 */
function Grid({ classes = '', className = '', children }) {
  return (
    <div className={`grid ${classes} ${className}`.trim()}>
      {children}
    </div>
  )
}

export default Grid