import React from "react"

function MessagePlusIcon({ className } : { className?: string}) {
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
			<path d='M8 9h8' />
			<path d='M8 13h6' />
			<path d='M12.01 18.594l-4.01 2.406v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v5.5' />
			<path d='M16 19h6' />
			<path d='M19 16v6' />
		</svg>
	)
}

export default MessagePlusIcon
