"use client"
import React, { useEffect, useState } from "react"
import Button from "@/ui/Button"
import { PlusIcon } from "@/icons"
import CardPost from "@/ui/CardPost"
import InputSearch from "@/ui/InputSearch"
import Link from "next/link"
import { useQuery } from "@apollo/client"
import { GET_POSTS } from "../lib/graphql/posts"
import { GetPosts, DataPosts } from "../lib/types/typesGraphql"
import FiltersResponsive from "../components/ui/FiltersResponsive"

function Home() {
	const [posts, setPosts] = useState<DataPosts[]>([])
	const [cursor, setCursor] = useState('')
	const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false);
	const { data, loading, error, fetchMore } = useQuery<GetPosts>(GET_POSTS, {
		fetchPolicy: "network-only",
		variables: {
			cursor: null,
			take: 5
		},
    notifyOnNetworkStatusChange: true, 
	})


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
		if (data?.getPosts) {
      setPosts((prevPosts) => [...prevPosts, ...data.getPosts.posts]);
			setCursor(data.getPosts.cursor)
			setHasMore(data.getPosts.hasMore)
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

		if (res.data.getPosts) {
			setPosts(prevPosts => prevPosts.concat(res.data.getPosts.posts))
			setCursor(res.data.getPosts.cursor)
			setHasMore(res.data.getPosts.hasMore)
		}
		setLoadingMore(false)
	}

	return (
		<>
			<section className='flex flex-col h-full items-center w-full  gap-5'>
				<div className='flex flex-col justify-center items-center w-full max-w-md'>
					<InputSearch />
					<div className='md:hidden flex items-center justify-center border-b border-white/40 w-full'>
						<FiltersResponsive/>
					</div>
				</div>
				{posts?.length == 0 ? (
					<div>
						<p>No hay componentes de momento</p>
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

				{loadingMore && <p className="py-2">Cargando más...</p>}
				{(!loadingMore && posts.length >= 1 && hasMore) && (
					<Button
						className='px-3 text-sm sm:text-base'
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

export default Home
