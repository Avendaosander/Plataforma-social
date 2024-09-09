"use client"

import React, { useState } from "react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useMutation, useQuery } from "@apollo/client"
import { PostFollower, DataPosts, DeleteFollower } from "@/typesGraphql"
import { getTimeElapsed, truncateText } from "@/app/lib/logic"
import Button from "./Button"
import {
	BookmarkPlusIcon,
	ShareIcon,
	MessageIcon,
	StarIcon,
	UserIcon
} from "@/icons"
import {
	DELETE_FOLLOWER,
	GET_FOLLOWERS,
	POST_FOLLOWER
} from "@/app/lib/graphql/followers"
import { GET_USER } from "@/app/lib/graphql/users"
import ButtonBookmark from "./ButtonBookmark"

interface PropsCardPost {
	post: DataPosts
	following?: boolean
	hiddenButton?: boolean
}

function CardPost({
	post,
	following = false,
	hiddenButton = false
}: PropsCardPost) {
	const [isFollowing, setIsFollowing] = useState(following)
	const { data: sessionData } = useSession()
	const idUser = localStorage.getItem("idUser")

	const { refetch: refetchGetfollowers } = useQuery(GET_FOLLOWERS, {
		variables: { idFollower: idUser },
		skip: true
	})
	const { refetch: refetchGetUser } = useQuery(GET_USER, {
		variables: { id: idUser },
		skip: true
	})
	const { refetch: refetchGetUserFollow } = useQuery(GET_USER, {
		variables: { id: post.user.id },
		skip: true
	})

	const [postFollower, { data: followers, error: errorFollowers }] =
		useMutation<PostFollower>(POST_FOLLOWER)

	const [deleteFollower, { data: follower, error: errorFollower }] =
		useMutation<DeleteFollower>(DELETE_FOLLOWER)

	const isAuthor = sessionData?.user.id === post.user.id
	const handleFollowing = async () => {
		if (isFollowing) {
			const res = await deleteFollower({
				variables: {
					idFollower: sessionData?.user.id,
					idFollowing: post.user.id
				}
			})

			if (res.data?.deleteFollower) {
				setIsFollowing(false)
				await refetchGetfollowers()
				await refetchGetUser()
				await refetchGetUserFollow()
			}
		} else {
			const res = await postFollower({
				variables: {
					idFollower: sessionData?.user.id,
					idFollowing: post.user.id
				}
			})

			if (res.data?.postFollower) {
				setIsFollowing(true)
				await refetchGetfollowers()
				await refetchGetUser()
				await refetchGetUserFollow()
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
						(isFollowing ? (
							<Button
								variant='solid'
								color='primary'
								shape='md'
								size='md'
								className='px-3 py-0.5'
								onClick={handleFollowing}
							>
								Siguiendo
							</Button>
						) : (
							<Button
								variant='outline'
								color='primary'
								shape='md'
								size='md'
								className='px-3 py-0.5 dark:bg-inherit dark:ring-white dark:text-white'
								onClick={handleFollowing}
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
						>
							Vista Previa
						</Button>
					</div>
				</div>
			</div>
			<footer className='border-t border-seagreen-950/40 dark:border-white/40 flex justify-between px-3 pt-3'>
				<div className='flex gap-1 items-center'>
					<div className='flex gap-1'>
						<StarIcon className='size-5 fill-yellow-400 stroke-yellow-400' />
						<StarIcon className='size-5 fill-yellow-400 stroke-yellow-400' />
						<StarIcon className='size-5 fill-yellow-400 stroke-yellow-400' />
						<StarIcon className='size-5 ' />
						<StarIcon className='size-5 ' />
					</div>
					<p className='font-light'>3.2</p>
				</div>
				<div className='flex gap-1 items-center'>
					<MessageIcon className='size-5' />
					<p className='font-light'>{post.comments}</p>
				</div>
				<ShareIcon className='size-5' />
				<ButtonBookmark idUser={idUser as string} idPost={post.id} isSaved={false}/>
			</footer>
		</article>
	)
}

export default CardPost
