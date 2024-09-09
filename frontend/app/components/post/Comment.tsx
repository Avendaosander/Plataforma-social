import { getTimeElapsed } from '@/app/lib/logic'
import { CommentsWithData } from '@/app/lib/types/typesGraphql'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface CommentProps {
  comment: CommentsWithData
}

function Comment({ comment }: CommentProps) {
  const avatarSrc = comment?.user?.avatar
		? `${process.env.NEXT_PUBLIC_API_ROUTE_AVATAR}${comment.user.avatar}`
		: '/User.png'

  return (
    <div className='flex items-start px-3 py-2 rounded-xl gap-2 hover:bg-white/10'>
      <Link
        href={`/home/profile/${comment.user.id}`}
        className='flex gap-2 items-center'
      >
        <Image
          src={avatarSrc}
          alt={comment.user.username}
          width={32}
          height={32}
          className='size-8 aspect-square'
        />
      </Link>
      <div className='flex flex-col gap-1'>
        <div className='flex justify-between items-center'>
          <p className='text-sm font-semibold'>{comment.user.username}</p>
          <span className='opacity-75 text-xs'>{getTimeElapsed(comment.createdAt)}</span>
        </div>
        <p className='text-xs font-light'>{comment.text}</p>
      </div>
    </div>
  )
}

export default Comment