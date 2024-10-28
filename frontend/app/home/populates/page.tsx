'use client'
import PlusIcon from '@/app/components/icons/PlusIcon'
import Button from '@/app/components/ui/Button'
import CardPost from '@/app/components/ui/CardPost'
import InputSearch from '@/app/components/ui/InputSearch'
import { GET_POSTS_POPULATE } from '@/app/lib/graphql/posts'
import { DataPosts, GetPostsPopulate } from '@/app/lib/types/typesGraphql'
import { useQuery } from '@apollo/client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

function Page() {
	const { data, loading, error, fetchMore } = useQuery<GetPostsPopulate>(GET_POSTS_POPULATE, {
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
		if (data?.getPostsPopulate) {
			console.log(data.getPostsPopulate.posts)
      setPosts((prevPosts) => [...prevPosts, ...data.getPostsPopulate.posts]);
			setCursor(data.getPostsPopulate.cursor)
			setHasMore(data.getPostsPopulate.hasMore)
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

		if (res.data.getPostsPopulate) {
			setPosts(prevPosts => prevPosts.concat(res.data.getPostsPopulate.posts))
			setCursor(res.data.getPostsPopulate.cursor)
			setHasMore(res.data.getPostsPopulate.hasMore)
		}
		setLoadingMore(false)
	}

  return (
		<>
			<section className='flex flex-col h-full items-center w-full gap-5'>
				<InputSearch />
				{posts?.length == 0 ? (
					<div>
						<p>Aun no hay componentes resaltantes este mes, destaca el tuyo</p>
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