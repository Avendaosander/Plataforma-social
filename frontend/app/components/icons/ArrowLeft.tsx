import React from "react"

function ArrowLeft({ className } : { className?: string}) {
	return (
		<svg
      className={className}
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			stroke-width='1.5'
			stroke-linecap='round'
			stroke-linejoin='round'
		>
			<path
				stroke='none'
				d='M0 0h24v24H0z'
				fill='none'
			/>
			<path d='M5 12l14 0' />
			<path d='M5 12l6 6' />
			<path d='M5 12l6 -6' />
		</svg>
	)
}

export default ArrowLeft
