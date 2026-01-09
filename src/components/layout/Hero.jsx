import React from 'react'

export default function Hero({
  title, // String: Main heading 
  subtitle, // String: Subtitle text 
  ctaPrimary, // Object: { text, href } for the main CTA button
  ctaSecondary, // Object: { text, href } for the secondary CTA link
  announcement // Object: { text, href } for the announcement banner (hidden if empty)
}){
  return(
    <div className="container px-12">

      
      <div className='bg-lime-100 p-6'>
        {/* Announcement Banner (Hidden if empty) */}
        {announcement?.text && (
          <div className=" w-fit mb-4">
            <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-forest-900/10 hover:ring-forest-900/20">
              {announcement.text}{' '}
              <a href={announcement.href} className="font-semibold text-mango-600">
                <span aria-hidden="true" className="absolute inset-0" />
                Read more
              </a>
            </div>
          </div>
        )}
        {/* Title or Leading Text (Hidden if empty) */}
        {title && (
          <h1 className="max-w-l text-5xl font-semibold tracking-tight text-balance text-lime-700 sm:text-7xl">
            {title}
          {/* Lorem ipsum dolor sit amet consectetur adipisicing. */}
          </h1>
        )}

        {subtitle && (
          <p className="mt-8 text-lg font-medium text-pretty text-forest-300 sm:text-xl/8">
            {subtitle}
          </p>
        )}

        {/* CTA Buttons (Hidden if empty) */}
        <div className="mt-10 flex items-center  gap-x-6">
          {ctaPrimary?.text && (
            <a
              href={ctaPrimary.href}
              className="rounded-full bg-forest-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-forest-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-600"
            >
              {ctaPrimary.text}
            </a>
          )}
          {ctaSecondary?.text && (
            <a href={ctaSecondary.href} className="text-sm/6 font-semibold text-lime-900">
              {ctaSecondary.text}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
