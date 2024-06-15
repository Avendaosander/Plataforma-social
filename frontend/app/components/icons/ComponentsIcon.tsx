import React from "react"

function ComponentsIcon({ className } : { className?: string}) {
	return (
		<svg
      className={className}
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='1.5'
			strokeLinecap='round'
			strokeLinejoin='round'
		>
			<path
				stroke='none'
				d='M0 0h24v24H0z'
				fill='none'
			/>
			<path d='M3 12l3 3l3 -3l-3 -3z' />
			<path d='M15 12l3 3l3 -3l-3 -3z' />
			<path d='M9 6l3 3l3 -3l-3 -3z' />
			<path d='M9 18l3 3l3 -3l-3 -3z' />
		</svg>
	)
}

export default ComponentsIcon
