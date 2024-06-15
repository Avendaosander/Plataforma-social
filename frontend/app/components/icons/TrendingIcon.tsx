import React from "react"

function TrendingIcon({ className } : { className?: string}) {
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
			<path d='M3 17l6 -6l4 4l8 -8' />
			<path d='M14 7l7 0l0 7' />
		</svg>
	)
}

export default TrendingIcon
