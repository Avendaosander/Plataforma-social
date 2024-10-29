'use client'
import PlusIcon from '@/app/components/icons/PlusIcon'
import Button from '@/app/components/ui/Button'
import CardPost from '@/app/components/ui/CardPost'
import FiltersResponsive from '@/app/components/ui/FiltersResponsive'
import InputSearch from '@/app/components/ui/InputSearch'
import { GET_POSTS_FOLLOWINGS } from '@/app/lib/graphql/posts'
import { DataPosts, GetPostsFollowings } from '@/app/lib/types/typesGraphql'
import { useQuery } from '@apollo/client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

function Page() {
	const { data, loading, error, fetchMore } = useQuery<GetPostsFollowings>(GET_POSTS_FOLLOWINGS, {
		fetchPolicy: "network-only"
	})

	const [posts, setPosts] = useState<DataPosts[]>([])
	const [cursor, setCursor] = useState('')
	const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false);

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
      setPosts((prevPosts) => [...prevPosts, ...data.getPostsFollowings.posts]);
			setCursor(data.getPostsFollowings.cursor)
			setHasMore(data.getPostsFollowings.hasMore)
		}
	}, [data])

	const morePosts = async () => {
		setLoadingMore(true)
		const res = await fetchMore({
			variables: {
				cursor,
				take: 5
			}
		})

		if (res.data.getPostsFollowings) {
			setPosts(prevPosts => prevPosts.concat(res.data.getPostsFollowings.posts))
			setCursor(res.data.getPostsFollowings.cursor)
			setHasMore(res.data.getPostsFollowings.hasMore)
		}
		setLoadingMore(false)
	}

  return (
		<>
			<section className='flex flex-col h-full items-center w-full gap-5'>
				<div className='flex flex-col justify-center items-center w-full max-w-md'>
					<InputSearch />
					<div className='md:hidden flex items-center justify-center border-b border-white/40 w-full'>
						<FiltersResponsive/>
				</div>
				</div>
				{posts?.length == 0 ? (
					<div>
						<p>Los usuarios que sigues aun no publican sus componentes</p>
					</div>
				):(
					posts.map(post => (
						<CardPost
							key={post.id}
							post={post}
							handleFollowing={handleFollowing}
							handleSaved={handleSaved}
						/>
					)
				))}
				{loadingMore && <p className='py-2'>Cargando más...</p>}
				{(!loadingMore && posts.length >= 1 && hasMore) && (
					<Button
						className='px-3'
						variant="flat"
						onClick={() => morePosts()}
					>
						Cargar mas componentes
					</Button>
				)}
			</section>
			<Link href={"/home/create"}>
				<Button
					className='fixed bottom-12 md:bottom-5 right-5 px-3'
					startContent={<PlusIcon />}
				>
					<p className="hidden lg:block">
						Crear
					</p>
				</Button>
			</Link>
		</>
  )
}

export default Page