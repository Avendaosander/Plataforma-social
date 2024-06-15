import toast  from "react-hot-toast";
import { CheckIcon, InfoIcon, XIcon } from "@/icons/icons";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

interface Props {
	text: string
	variant: 'success' | 'error' | 'info'
	duration?: number
}

const variantClasses = {
	success: "bg-lime-50 ring-lime-400 text-seagreen-950",
	error: "bg-maroon-50 ring-maroon-400 text-maroon-950",
	info: "bg-biscay-50 ring-biscay-400 text-biscay-950",
}

const icon = {
	success: <CheckIcon className="size-5"/>,
	error: <XIcon className="size-5"/>,
	info: <InfoIcon className="size-5"/>,
}

export const toastCustom = ({ text, variant, duration }: Props) => {
	toast.custom((t) => (
    <div className={twMerge(
			clsx(
				variantClasses[variant],
				"ring-1 rounded-xl flex items-center justify-between gap-2 py-2 px-4"
			)
		)}>
			<div className="flex items-center w-full gap-2">
				{icon[variant]}
				<p className="text-lg font-medium">{text}</p>
			</div>
		</div>
	), {
		duration,
		position: "bottom-right",
	})
}