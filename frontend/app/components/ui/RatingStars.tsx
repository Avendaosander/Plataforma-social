import React from 'react'
import StarIcon from '../icons/StarIcon'
import StarHalfIcon from '../icons/StarHalfIcon'

function RatingStars({rating}: {rating: number}) {
  const maxRating = 5

  return (
    <div className="flex gap-0.5 sm:gap-1 items-center -z-10">
      {[...Array(maxRating)].map((_, index) => {
        const ratingValue = index + 1;

        // Comprueba si la calificación actual es mayor o igual a ratingValue
        if (ratingValue <= Math.floor(rating)) {
          // Estrella completa
          return (
            <StarIcon
              key={index}
              className="size-4 sm:size-5 fill-yellow-400 text-yellow-400"
            />
          );
        }

        // Si la calificación es x.5, muestra la media estrella
        if (ratingValue === Math.ceil(rating) && rating % 1 >= 0.5) {
          // Media estrella
          return (
            <StarHalfIcon
              key={index}
              className="size-4 sm:size-5 text-yellow-400"
            />
          );
        }

        // Estrella vacía
        return (
          <StarIcon key={index} className="size-4 sm:size-5 opacity-50" />
        );
      })}
      <p className='font-light text-xs sm:text-base ml-1'>{rating}</p>
    </div>
  );
}

export default RatingStars