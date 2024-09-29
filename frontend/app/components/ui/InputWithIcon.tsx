'use client'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import React from 'react'
import { twMerge } from 'tailwind-merge'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  text: string
  setText: (text: string) => void
  handleChange: (text: string) => void
  endContent: React.ReactNode,
  onSubmit: (text: string) => void
}

const inputClasses = 'outline-none font-medium px-3 py-1 bg-inherit placeholder:font-medium w-full'

function InputWithIcon({className, text, setText, handleChange, endContent, onSubmit, ...props}:Props) {
  const pathname = usePathname()
  
  const submitText = () => {
    onSubmit(text)
    if (pathname != '/home' && pathname != '/home/search') {
      setText('')
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      submitText()
    }
  }

  return (
    <div className='flex items-center w-full max-w-md bg-storm-50 ring-1 ring-seagreen-950 rounded-full pl-3 text-seagreen-950 dark:bg-storm-900 dark:ring-white dark:text-white'>
      <input 
        className={twMerge(
          clsx(
            inputClasses,
            className
          )
        )}
        value={text}
        {...props}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={e => handleKeyDown(e)}
      />
      <div className='h-[50%] w-[1px] bg-seagreen-950 dark:bg-white'></div>
      <button className='px-3 py-2 hover:bg-seagreen-900/20 rounded-r-full' onClick={() => submitText()}>
        {endContent}
      </button>
    </div>
  )
}

export default InputWithIcon