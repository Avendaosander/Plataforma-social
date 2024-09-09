import Image from "next/image"
import React from "react"

function LogoIcon({ className }: { className?: string }) {
	return (
		<Image
      className={className}
			src={"/Logo/main-logo-white-transparent.png"}
			alt='logo'
			width={24}
			height={24}
		/>
	)
}

export default LogoIcon
