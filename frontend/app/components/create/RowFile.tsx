import React from 'react'
import Button from '@/ui/Button'
import { TrashIcon } from '@/icons'

interface Props {
  children: React.ReactNode
  onRemove: () => void
}

function RowFile({ children, onRemove }: Props) {
  return (
    <div className='w-full flex justify-between items-center'>
      <p className='text-sm font-medium'>
        { children }
      </p>
      <Button 
        color='destructive'
        variant='solid'
        shape='sm'
        className='py-1 px-1'
        startContent={<TrashIcon className='size-5'/>}
        onClick={onRemove}
      />
    </div>
  )
}

export default RowFile