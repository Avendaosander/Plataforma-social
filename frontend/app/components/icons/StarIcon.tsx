import React from "react"

interface StarIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

function StarIcon({ className, ...props } : StarIconProps) {
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
			{...props}
		>
			<path
				stroke='none'
				d='M0 0h24v24H0z'
				fill='none'
			/>
			<path d='M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z' />
		</svg>
	)
}

export default StarIcon
