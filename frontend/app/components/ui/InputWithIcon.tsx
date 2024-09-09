import clsx from 'clsx'
import React from 'react'
import { twMerge } from 'tailwind-merge'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  endContent: React.ReactNode,
  onSubmit: ()=> void
}

const inputClasses = 'outline-none font-medium px-3 py-1 bg-inherit placeholder:font-medium w-full'

function InputWithIcon({className, endContent, onSubmit, ...props}:Props) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSubmit();
    }
  }

  return (
    <div className='flex items-center w-full max-w-[400px] bg-storm-50 ring-1 ring-seagreen-950 rounded-full pl-3 text-seagreen-950 dark:bg-storm-900 dark:ring-white dark:text-white'>
      <input 
        className={twMerge(
          clsx(
            inputClasses,
            className
          )
        )}
        onKeyDown={e => handleKeyDown(e)}
        {...props}
      />
      <div className='h-[50%] w-[1px] bg-seagreen-950 dark:bg-white'></div>
      <button className='px-3 py-2 hover:bg-seagreen-900/20 rounded-r-full' onClick={onSubmit}>
        {endContent}
      </button>
    </div>
  )
}

export default InputWithIcon