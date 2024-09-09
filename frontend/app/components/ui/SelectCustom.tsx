'use client'
import React, { ChangeEvent, useState } from 'react'
import RightArrowIcon from '../icons/RightArrowIcon'
import { GetTechnology } from '@/app/lib/types/typesGraphql'
import { existTech } from '@/app/lib/logic'

interface PropsSelect {
  data: GetTechnology[] | undefined
  handleCheckboxChange: (e : ChangeEvent<HTMLInputElement>) => void
  stack: GetTechnology[]
}

function SelectCustom({ data, handleCheckboxChange, stack }: PropsSelect) {
	const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        className='flex items-center justify-between bg-white dark:bg-storm-900 pl-5 pr-1 py-1 rounded-md outline-none gap-3'
        id='tech'
        onClick={e => {
          e.preventDefault()
          setIsOpen(!isOpen)
        }}
      >
        Tecnologias
        <RightArrowIcon className="size-5 rotate-90" />
      </button>
      {isOpen && (
      <div className='absolute z-20 top-full left-0 overflow-y-auto max-h-80 w-full bg-white dark:bg-storm-900 rounded-lg mt-[1px]'>
        {data?.map(tech => (
          <label
            htmlFor={tech.id}
            key={tech.id}
            className='hover:bg-storm-500/50 cursor-pointer pl-3 py-1 flex gap-2 first:rounded-t-lg last:rounded-b-lg'
          >
            <input
              type='checkbox'
              name='tech'
              id={tech.id}
              value={tech.name}
              onChange={handleCheckboxChange}
              checked={existTech(stack, tech.id)}
            />
            {tech.name}
          </label>
        ))}
          <label
            htmlFor='Other'
            className='hover:bg-storm-500/50 cursor-pointer pl-3 py-1 flex gap-2 first:rounded-t-lg last:rounded-b-lg'
          >
            <input
              type='checkbox'
              name='tech'
              id='Other'
              value='Other'
              onChange={handleCheckboxChange}
              checked={existTech(stack, 'Other')}
            />
            Otro
          </label>
      </div>
    )}
    </div>

  )
}

export default SelectCustom