import React from 'react'
import { BookmarkFilled, BookmarkPlusIcon } from '@/icons'

interface ButtonBookmarkProps {
  idUser: string
  idPost: string
  isSaved: boolean
}
function ButtonBookmark({ idUser, idPost, isSaved }: ButtonBookmarkProps) {
  return (
    <button className='flex' onClick={() => {}}>
      {isSaved ? (
        <BookmarkFilled className='size-5 text-lima-400'/>
      ) : (
        <BookmarkPlusIcon className='size-5' />
      )}
    </button>
  )
}

export default ButtonBookmark