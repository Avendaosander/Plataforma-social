import { useState } from "react"
import StarIcon from "../icons/StarIcon"

interface StarRatingProps {
	rating: number
	onRatingChange: (rating: number) => void
}

function InputRatingStar({ onRatingChange, rating }: StarRatingProps) {
	const maxRating = 5
	const [hoverRating, setHoverRating] = useState<number>(0)
	const [currentRating, setCurrentRating] = useState<number>(rating)

	const handleMouseEnter = (rating: number) => setHoverRating(rating)
	const handleMouseLeave = () => setHoverRating(0)
	const handleClick = (rating: number) => {
		setCurrentRating(rating)
		onRatingChange(rating)
	}

	return (
		<div className="flex flex-col gap-1 items-center">
			<div className='flex gap-1 items-center'>
				{[...Array(maxRating)].map((_, index) => {
					const ratingValue = index + 1
					return (
						<StarIcon
							key={index}
							onMouseEnter={() => handleMouseEnter(ratingValue)}
							onMouseLeave={handleMouseLeave}
							onClick={() => handleClick(ratingValue)}
							className={`size-7 ${
								ratingValue <= (hoverRating || currentRating)
									? "fill-yellow-400 text-yellow-400"
									: ""
							}`}
						/>
					)
				})}
				<p className="text-xl ml-1">{currentRating}</p>
			</div>
			{rating === undefined && (
				<p className="font-light text-sm opacity-50">Aun no has calificado este componente</p>
			)}
		</div>
	)
}

export default InputRatingStar
