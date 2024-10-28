import React from "react"
interface XIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

function XIcon({className, ...props }: XIconProps) {
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
			<path d='M18 6l-12 12' />
			<path d='M6 6l12 12' />
		</svg>
	)
}

export default XIcon
