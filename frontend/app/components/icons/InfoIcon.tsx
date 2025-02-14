import React from "react"

function InfoIcon({ className } : { className?: string}) {
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
			<path d='M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0' />
			<path d='M12 9h.01' />
			<path d='M11 12h1v4h1' />
		</svg>
	)
}

export default InfoIcon
