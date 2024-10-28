"use client"

import React, { useState } from "react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useMutation } from "@apollo/client"
import { PostFollower, DataPosts, DeleteFollower, postPostSaved, deletePostSaved, PostSavedInput } from "@/typesGraphql"
import { getTimeElapsed, truncateText } from "@/app/lib/logic"
import Button from "./Button"
import {
	ShareIcon,
	MessageIcon,
	XIcon,
} from "@/icons"
import {
	DELETE_FOLLOWER,
	POST_FOLLOWER
} from "@/app/lib/graphql/followers"
import ButtonBookmark from "./ButtonBookmark"
import { DELETE_POST_SAVED, POST_POST_SAVED } from "@/app/lib/graphql/posts_saveds"
import RatingStars from "./RatingStars"
import { useFilterSearchStore } from "@/app/store/filterSearch"
import ShareModal from "./ShareModal"

interface PropsCardPost {
	post: DataPosts
	hiddenButton?: boolean
	handleFollowing: (idUser: string, isFollowing: boolean) => void
	handleSaved: (idPost: string, isSaved: boolean, saved: number) => void
}

function CardPost({
	post,
	hiddenButton = false,
	handleFollowing,
	handleSaved
}: PropsCardPost) {
	const { data: sessionData } = useSession()
	const setFilter = useFilterSearchStore(state => state.setFilterSearh)
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);
	const [isShareModalOpen, setIsShareModalOpen] = useState(false)
	const shareUrl = `${process.env.NEXT_PUBLIC_URL}home/post/${post.id}`

  const togglePreview = () => {
    document.startViewTransition?.(() => setIsPreviewOpen(!isPreviewOpen));
  };
	
	const closePreview = () => {
    document.startViewTransition?.(() => setIsPreviewOpen(false));
  }

	const [postFollower, { data: followers, error: errorFollowers }] =
		useMutation<PostFollower>(POST_FOLLOWER)

	const [deleteFollower, { data: follower, error: errorFollower }] =
		useMutation<DeleteFollower>(DELETE_FOLLOWER)

	const [postPostSaved, { data: postSaved, error: errorPostSaved }] =
		useMutation<postPostSaved,PostSavedInput>(POST_POST_SAVED)

	const [deletePostSaved, { data: postSavedDeleted, error: errorPostSavedDelete }] =
		useMutation<deletePostSaved,PostSavedInput>(DELETE_POST_SAVED)

	const isAuthor = sessionData?.user.id === post.user.id

	const handleFetchFollowing = async () => {
		if (post.isFollowing) {
			const res = await deleteFollower({
				variables: {
					idFollower: sessionData?.user.id,
					idFollowing: post.user.id
				}
			})

			if (res.data?.deleteFollower) {
				handleFollowing(post.user.id, false)
			}
		} else {
			const res = await postFollower({
				variables: {
					idFollower: sessionData?.user.id,
					idFollowing: post.user.id
				}
			})

			if (res.data?.postFollower) {
				handleFollowing(post.user.id, true)
			}
		}
	}

	const handleFetchPostSaved = async () => {
		if (post.isSaved) {
			const res = await deletePostSaved({
				variables: {
					idPost: post.id,
					idUser: sessionData?.user.id as string
				}
			})
			
			if (res.data?.deletePostSaved) {
				handleSaved(post.id, false, post.saved - 1)
			}
		} else {
			const res = await postPostSaved({
				variables: {
					idPost: post.id,
					idUser: sessionData?.user.id as string
				}
			})

			if (res.data?.postPostSaved) {
				handleSaved(post.id, true, post.saved + 1)
			}
		}
	}

	const avatarSrc = post?.user?.avatar
		? `${process.env.NEXT_PUBLIC_API_ROUTE_AVATAR}${post.user.avatar}`
		: '/User.png'
	const previewSrc = post?.preview
		? `${process.env.NEXT_PUBLIC_API_ROUTE_PREVIEW}${post.preview}`
		: "/Image.png"

	return (
		<article className='flex flex-col gap-3 p-3 w-full max-w-3xl rounded-2xl ring-1 ring-seagreen-900 bg-white dark:bg-transparent dark:ring-white'>
			<header className='flex justify-between items-center'>
				<div className='flex gap-2 items-center'>
					<Link
						href={`/home/profile/${post.user.id}`}
						className='flex gap-2 items-center'
					>
						<Image
							src={avatarSrc}
							alt={post.user.username}
							width={20}
							height={20}
						/>
						<p className='text-lg font-medium'>{post.user.username}</p>
					</Link>
					{!isAuthor &&
						!hiddenButton &&
						(post.isFollowing ? (
							<Button
								variant='outline'
								color='primary'
								shape='md'
								size='md'
								className='px-3 py-0.5 dark:bg-inherit dark:ring-white dark:text-white'
								onClick={handleFetchFollowing}
							>
								Siguiendo
							</Button>
						) : (
							<Button
								variant='solid'
								color='primary'
								shape='md'
								size='md'
								className='px-3 py-0.5'
								onClick={handleFetchFollowing}
							>
								Seguir
							</Button>
						))}
				</div>
				<span className='opacity-75'>{getTimeElapsed(post.createdAt)}</span>
			</header>
			<Link href={`/home/post/${post.id}`}>
				<h3 className='text-lg font-bold px-2'>{post.title}</h3>
			</Link>
			<div className='flex justify-between gap-3'>
				<div className='flex flex-col gap-3 h-full justify-between'>
					<p className='text-lg max-w-[50ch] px-2'>
						{truncateText(post.description, 290)}
					</p>
					<div className='flex text-start gap-2 p-2 '>
						{post?.Stack?.length > 0 &&
							post.Stack.map(tech => (
								<Link
									key={tech.idTechnology}
									href={`/home/search?query=${tech.tech.name}`}
									onClick={() => setFilter(['technology', 'rating'])}
								>
									<Button
										variant='flat'
										color='secondary'
										shape='full'
										size='sm'
										marginX='none'
										className='px-3 py-0.5'
									>
										{tech.tech.name}
									</Button>
								</Link>
							))}
					</div>
				</div>
				<div className='flex flex-col items-center gap-3 h-full justify-between'>
					<div className='p-6'>
						<Image
							src={previewSrc}
							alt={post.title}
							width={120}
							height={120}
						/>
					</div>
					<div className='p-2'>
						<Button
							variant='flat'
							color='secondary'
							shape='full'
							size='sm'
							className='px-3 py-0.5'
          		onClick={togglePreview}
						>
							Vista Previa
						</Button>
					</div>
					{isPreviewOpen && (
						<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-20" onClick={closePreview}>
							<XIcon
								className="absolute top-5 right-5 text-white text-xl font-bold cursor-pointer z-20"
								onClick={closePreview}
							/>
							<div className="relative" onClick={(e) => e.stopPropagation()}>
								<Image
									src={previewSrc}
									alt={post.title}
									width={500}
									height={500}
									className="transition-transform duration-500 ease-in-out transform scale-100"
								/>
							</div>
						</div>
					)}
				</div>
			</div>
			<footer className='border-t border-seagreen-950/40 dark:border-white/40 flex justify-between px-3 pt-3'>
				<div className='flex gap-1 items-center'>
					<RatingStars rating={post.rating}/>
				</div>
				<div className='flex gap-1 items-center'>
					<MessageIcon className='size-5' />
					<p className='font-light'>{post.comments}</p>
				</div>
				<ShareIcon className='size-5 cursor-pointer' onClick={() => setIsShareModalOpen(true)}/>
				<div className='flex gap-1 items-center'>
					<p className='font-light'>{post.saved}</p>
					<ButtonBookmark isSaved={post.isSaved} handlePostSaved={handleFetchPostSaved}/>
				</div>
			</footer>
			{isShareModalOpen && (
				<ShareModal
					onClose={() => setIsShareModalOpen(false)}
					shareUrl={shareUrl}
				/>
			)}
		</article>
	)
}

export default CardPost
