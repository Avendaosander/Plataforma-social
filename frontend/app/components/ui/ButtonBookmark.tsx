import React from 'react'
import { BookmarkFilled, BookmarkPlusIcon } from '@/icons'

interface ButtonBookmarkProps {
  isSaved: boolean
  handlePostSaved: () => void
}
function ButtonBookmark({ isSaved, handlePostSaved }: ButtonBookmarkProps) {
  return (
    <button className='flex' onClick={() => {handlePostSaved()}}>
      {isSaved ? (
        <BookmarkFilled className='size-4 sm:size-5 text-lima-400'/>
      ) : (
        <BookmarkPlusIcon className='size-4 sm:size-5' />
      )}
    </button>
  )
}

export default ButtonBookmark