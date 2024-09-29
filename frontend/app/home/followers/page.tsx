'use client'
import PlusIcon from '@/app/components/icons/PlusIcon'
import Button from '@/app/components/ui/Button'
import CardPost from '@/app/components/ui/CardPost'
import InputSearch from '@/app/components/ui/InputSearch'
import { GET_POSTS_FOLLOWINGS } from '@/app/lib/graphql/posts'
import { DataPosts, GetPostsFollowings } from '@/app/lib/types/typesGraphql'
import { useQuery } from '@apollo/client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

function Page() {
	const { data, loading, error } = useQuery<GetPostsFollowings>(GET_POSTS_FOLLOWINGS, {
		fetchPolicy: "network-only"
	})

	const [posts, setPosts] = useState<DataPosts[]>([])

	const handleFollowing = (idUser: string, isFollowing: boolean) => {
		setPosts(prevPosts =>
			prevPosts.map(post =>
				post.user.id === idUser ? { ...post, isFollowing } : post
			)
		)
	}

	const handleSaved = (idPost: string, isSaved: boolean, saved: number) => {
		setPosts(prevPosts =>
			prevPosts.map(post => (post.id === idPost ? { ...post, isSaved, saved } : post))
		)
	}

	useEffect(() => {
		if (data?.getPostsFollowings) {
			setPosts(data.getPostsFollowings)
		}
	}, [data])

  return (
		<>
			<section className='flex flex-col h-full items-center w-full gap-5'>
				<InputSearch />
				{posts.map(post => (
					<CardPost
						key={post.id}
						post={post}
						handleFollowing={handleFollowing}
						handleSaved={handleSaved}
					/>
				))}
			</section>
			<Link href={"/home/create"}>
				<Button
					className='fixed bottom-5 right-5 px-3'
					startContent={<PlusIcon />}
				>
					Crear
				</Button>
			</Link>
		</>
  )
}

export default Page