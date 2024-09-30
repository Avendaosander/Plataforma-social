import Link from "next/link"
import React from "react"
import XIcon from "../icons/XIcon"

interface PropsTag {
	tagLink?: true | false
	children: React.ReactNode
	onRemove: () => void
}

const tagClasses = "bg-biscay-600/20 dark:bg-biscay-600 text-biscay-900 dark:text-white rounded-lg pl-2 pr-1 py-0.5 text-sm font-medium content-center"

function Tag({ tagLink = false, children, onRemove }: PropsTag) {
	return tagLink ? (
		<Link
			href={`/home/search?tech=${children}`}
			target="_blank"
			className={`${tagClasses}`}
		>
			{ children }
		</Link>
	) : (
		<span className={`${tagClasses} flex items-center gap-2`}>
      { children }
			<div onClick={onRemove}>
				<XIcon className="size-3 cursor-pointer"/>
			</div>
    </span>
	)
}

export default Tag
