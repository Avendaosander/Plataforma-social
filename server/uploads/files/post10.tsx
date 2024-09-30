import clsx from "clsx"
import React from "react"
import { twMerge } from "tailwind-merge"
import { Variants } from "./variants"

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "solid" | "outline" | "flat" | "ghost"
	color?: "primary" | "secondary" | "destructive"
	size?: "sm" | "md" | "lg"
	marginX?: "none" | "auto"
	shape?: "none" | "sm" | "md" | "lg" | "full"
	isOnlyIcon?: boolean,
  startContent?: React.ReactNode,
  endContent?: React.ReactNode,
}

const baseClasses = "flex items-center gap-2 font-semibold px-4 py-2"

const sizeClasses = {
	sm: "text-sm",
	md: "text-base",
	lg: "text-lg",
	xl: "text-xl"
}

const marginXClasses = {
	auto: 'mx-auto',
	none: 'mx-0'
}

const shapeClasses = {
	none: "rounded-none",
	sm: "rounded-lg",
	md: "rounded-xl",
	lg: "rounded-2xl",
	full: "rounded-full"
}

function Button({
	children,
	className,
	color = "primary",
	variant = "solid",
	size = "md",
	marginX = "none",
	shape = "md",
	isOnlyIcon = false,
  endContent,
  startContent,
	...props
}: Props) {
	return (
		<button
			className={twMerge(
				clsx(
					baseClasses,
					sizeClasses[size],
					marginXClasses[marginX],
					shapeClasses[shape],
					Variants[variant][color],
					isOnlyIcon ? 'm-0' : '',
					className
				)
			)}
			{...props}
		>
			{startContent}
			{children}
			{endContent}
		</button>
	)
}

export default Button
