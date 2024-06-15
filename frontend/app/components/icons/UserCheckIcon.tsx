import React from "react"

function UserCheck({ className } : { className?: string}) {
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
			<path d='M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0' />
			<path d='M6 21v-2a4 4 0 0 1 4 -4h4' />
			<path d='M15 19l2 2l4 -4' />
		</svg>
	)
}

export default UserCheck
