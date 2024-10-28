import { getTimeElapsed } from "@/app/lib/logic"
import { CommentsWithData } from "@/app/lib/types/typesGraphql"
import Image from "next/image"
import Link from "next/link"
import React, { useState } from "react"
import Button from "../ui/Button"
import DotsIcon from "../icons/DotsIcon"

interface CommentProps {
	comment: CommentsWithData
	onDelete: (id: string) => void
  authorizated: boolean
	isAutor: boolean
}

function Comment({ comment, onDelete, authorizated, isAutor }: CommentProps) {
	const [more, setMore] = useState(false)
	const avatarSrc = comment?.user?.avatar
		? `${process.env.NEXT_PUBLIC_API_ROUTE_AVATAR}${comment.user.avatar}`
		: "/User.png"

	return (
		<div className='relative flex items-start px-3 py-2 rounded-xl gap-2 hover:bg-white/10'>
			<Link
				href={`/home/profile/${comment.user.id}`}
				className='flex gap-2 items-center size-8'
			>
				<Image
					src={avatarSrc}
					alt={comment.user.username}
					width={32}
					height={32}
					className='size-8 aspect-square'
				/>
			</Link>
			<div className='flex flex-col gap-1 w-full'>
				<div className='flex items-center pr-3 gap-1'>
					<p className='text-sm font-semibold'>{comment.user.username}</p>
					<span className='opacity-75 text-xs'>
						- {getTimeElapsed(comment.createdAt)}
					</span>
				</div>
				<p className='text-xs font-light'>{comment.text}</p>
			</div>
      {(isAutor || authorizated) && (
        <div className='absolute top-1 right-1'>
          {more && (
            <div className='absolute top-full right-0 rounded-lg bg-seagreen-900 dark:bg-storm-900 p-1 z-10'>
              <Button
                color='primary'
                size='sm'
                className='py-1 px-2 w-full'
                onClick={() => onDelete(comment.id)}
              >
                Eliminar
              </Button>
            </div>
          )}
          <button
            onClick={() => setMore(!more)}
            className={`text-storm-100 size-4 ${
              more && "bg-storm-100/20 block"
            } rounded-full`}
          >
            <DotsIcon className={`size-4`} />
          </button>
        </div>
      )}
		</div>
	)
}

export default Comment
