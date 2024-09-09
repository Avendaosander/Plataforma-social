import React from "react"

function BookmarkFilled({ className } : { className?: string}) {
	return (
		<svg
      className={className}
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='currentColor'
		>
			<path
				stroke='none'
				d='M0 0h24v24H0z'
				fill='none'
			/>
			<path d='M14 2a5 5 0 0 1 5 5v14a1 1 0 0 1 -1.555 .832l-5.445 -3.63l-5.444 3.63a1 1 0 0 1 -1.55 -.72l-.006 -.112v-14a5 5 0 0 1 5 -5h4z' />
		</svg>
	)
}

export default BookmarkFilled
