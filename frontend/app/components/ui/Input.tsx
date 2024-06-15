import clsx from 'clsx'
import React from 'react'
import { twMerge } from 'tailwind-merge'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

const inputClasses = 'outline-none ring-1 ring-seagreen-950 dark:ring-white bg-storm-50 dark:bg-storm-900 rounded-lg py-1 px-3 font-normal placeholder:font-medium dark:placeholder:text-white/50 text-seagreen-950 dark:text-white'

function Input({className, ...props}:Props) {
  return (
    <input 
      className={twMerge(
        clsx(
          inputClasses,
          className
        )
      )}
      {...props}
    />
  )
}

export default Input