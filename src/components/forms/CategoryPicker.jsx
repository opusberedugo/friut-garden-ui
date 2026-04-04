import React, { useState, useMemo } from 'react'

/**
 * CategoryPicker — Hierarchical 3-way category selector.
 *
 * Props:
 *   label          {string}    – Section heading shown above the picker.
 *   categories     {Array}     – Full flat list from MongoDB:
 *                                [{ _id, name, parentId, level, description }]
 *   favorites      {Array}     – Controlled array of favorited category _id strings.
 *   exclusions     {Array}     – Controlled array of excluded category _id strings.
 *   onFavoritesChange  {Function} – Called with updated favorites array.
 *   onExclusionsChange {Function} – Called with updated exclusions array.
 *   className      {string}    – Extra wrapper class.
 *
 * Each parent card cycles through 3 states on click:
 *   neutral  →  favorite (green ❤)  →  excluded (red ✕)  →  neutral
 *
 * Clicking the chevron on a parent card expands its children inline.
 * Children have the same 3-way toggle, independently of the parent.
 */
export default function CategoryPicker({
  label = 'Categories',
  categories = [],
  favorites = [],
  exclusions = [],
  onFavoritesChange,
  onExclusionsChange,
  className = '',
}) {
  // Which parent group is expanded (shows its children)
  const [expandedParent, setExpandedParent] = useState(null)

  // ── Build the parent → children tree from the flat list ──────────
  const parents = useMemo(
    () => categories.filter((c) => c.level === 0),
    [categories]
  )

  const childrenOf = useMemo(() => {
    const map = {}
    categories
      .filter((c) => c.level > 0 && c.parentId)
      .forEach((c) => {
        if (!map[c.parentId]) map[c.parentId] = []
        map[c.parentId].push(c)
      })
    return map
  }, [categories])

  // ── State helpers ─────────────────────────────────────────────────
  function getState(id) {
    if (favorites.includes(id)) return 'favorite'
    if (exclusions.includes(id)) return 'excluded'
    return 'neutral'
  }

  function cycle(id) {
    const current = getState(id)

    if (current === 'neutral') {
      // → favorite
      onFavoritesChange([...favorites, id])
    } else if (current === 'favorite') {
      // → excluded  (remove from favorites, add to exclusions)
      onFavoritesChange(favorites.filter((v) => v !== id))
      onExclusionsChange([...exclusions, id])
    } else {
      // excluded → neutral  (remove from exclusions)
      onExclusionsChange(exclusions.filter((v) => v !== id))
    }
  }

  function toggleExpand(parentId) {
    setExpandedParent((prev) => (prev === parentId ? null : parentId))
  }

  // ── Counters for summary ──────────────────────────────────────────
  const favCount = favorites.length
  const excCount = exclusions.length

  return (
    <div className={`category-picker ${className}`}>

      {/* ── Section header ── */}
      <div className="flex items-center justify-between mb-3">
        <label className="block text-gray-700 font-medium">{label}</label>
        <div className="flex gap-3 text-xs">
          {favCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-forest-50 text-forest-600 border border-forest-200 font-medium">
              <span>❤</span> {favCount} liked
            </span>
          )}
          {excCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-500 border border-red-200 font-medium">
              <span>✕</span> {excCount} excluded
            </span>
          )}
        </div>
      </div>

      {/* ── Hint ── */}
      <p className="text-xs text-gray-400 mb-4">
        Click once to <span className="text-forest-600 font-medium">favourite</span>, click again to <span className="text-red-500 font-medium">exclude</span>, click once more to clear.
        Use the arrow to browse subcategories.
      </p>

      {/* ── Parent category cards ── */}
      <div className="flex flex-col gap-2">
        {parents.map((parent) => {
          const state = getState(parent._id)
          const children = childrenOf[parent._id] || []
          const isExpanded = expandedParent === parent._id
          const hasChildren = children.length > 0

          // How many children are favorited or excluded for this parent
          const childFavCount = children.filter((c) => favorites.includes(c._id)).length
          const childExcCount = children.filter((c) => exclusions.includes(c._id)).length

          return (
            <div key={parent._id}>

              {/* Parent row */}
              <div
                className={[
                  'flex items-center justify-between gap-3 px-4 py-3 rounded-xl border-2',
                  'transition-all duration-200',
                  state === 'favorite'
                    ? 'bg-forest-50 border-forest-400 shadow-sm'
                    : state === 'excluded'
                      ? 'bg-red-50 border-red-300 shadow-sm'
                      : 'bg-white border-gray-200 hover:border-gray-300',
                ].join(' ')}
              >

                {/* 3-way cycle button — left side */}
                <button
                  type="button"
                  id={`category-${parent._id}`}
                  onClick={() => cycle(parent._id)}
                  className="flex items-center gap-3 flex-1 text-left focus:outline-none group"
                  aria-label={`${parent.name}: ${state}. Click to cycle state.`}
                >
                  {/* State icon */}
                  <span
                    className={[
                      'flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold',
                      'transition-all duration-200',
                      state === 'favorite'
                        ? 'bg-forest-500 text-white'
                        : state === 'excluded'
                          ? 'bg-red-400 text-white'
                          : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200',
                    ].join(' ')}
                  >
                    {state === 'favorite' ? '❤' : state === 'excluded' ? '✕' : '○'}
                  </span>

                  {/* Name + description */}
                  <span className="flex flex-col min-w-0">
                    <span
                      className={[
                        'text-sm font-semibold leading-tight',
                        state === 'favorite'
                          ? 'text-forest-700'
                          : state === 'excluded'
                            ? 'text-red-600'
                            : 'text-gray-800',
                      ].join(' ')}
                    >
                      {parent.name}
                    </span>
                    {parent.description && (
                      <span className="text-xs text-gray-400 truncate">{parent.description}</span>
                    )}
                  </span>
                </button>

                {/* Right side: child badges + expand toggle */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {childFavCount > 0 && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-forest-100 text-forest-600 font-medium">
                      +{childFavCount}❤
                    </span>
                  )}
                  {childExcCount > 0 && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-100 text-red-500 font-medium">
                      +{childExcCount}✕
                    </span>
                  )}

                  {hasChildren && (
                    <button
                      type="button"
                      onClick={() => toggleExpand(parent._id)}
                      aria-expanded={isExpanded}
                      aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${parent.name} subcategories`}
                      className={[
                        'w-7 h-7 rounded-lg flex items-center justify-center',
                        'transition-all duration-200 focus:outline-none',
                        'text-gray-400 hover:bg-gray-100 hover:text-gray-600',
                        isExpanded ? 'rotate-180 bg-gray-100' : '',
                      ].join(' ')}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* ── Children (expanded) ── */}
              {isExpanded && hasChildren && (
                <div className="ml-6 mt-1 mb-2 flex flex-col gap-1.5 border-l-2 border-gray-100 pl-4">
                  {children.map((child) => {
                    const childState = getState(child._id)
                    return (
                      <button
                        key={child._id}
                        type="button"
                        id={`category-${child._id}`}
                        onClick={() => cycle(child._id)}
                        aria-label={`${child.name}: ${childState}. Click to cycle state.`}
                        className={[
                          'flex items-center gap-3 px-3 py-2 rounded-lg border text-left w-full',
                          'transition-all duration-150 focus:outline-none',
                          childState === 'favorite'
                            ? 'bg-forest-50 border-forest-300 text-forest-700'
                            : childState === 'excluded'
                              ? 'bg-red-50 border-red-200 text-red-600'
                              : 'bg-gray-50 border-gray-100 text-gray-700 hover:border-gray-200 hover:bg-white',
                        ].join(' ')}
                      >
                        <span
                          className={[
                            'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold',
                            childState === 'favorite'
                              ? 'bg-forest-500 text-white'
                              : childState === 'excluded'
                                ? 'bg-red-400 text-white'
                                : 'bg-gray-200 text-gray-400',
                          ].join(' ')}
                        >
                          {childState === 'favorite' ? '❤' : childState === 'excluded' ? '✕' : '○'}
                        </span>
                        <span className="flex flex-col min-w-0">
                          <span className="text-sm font-medium leading-tight">{child.name}</span>
                          {child.description && (
                            <span className="text-xs text-gray-400 truncate">{child.description}</span>
                          )}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}

            </div>
          )
        })}
      </div>

      {/* ── Empty state ── */}
      {parents.length === 0 && (
        <div className="text-center py-8 text-gray-400 text-sm">
          Loading categories…
        </div>
      )}

    </div>
  )
}
