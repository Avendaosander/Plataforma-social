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

function Home() {
	const [posts, setPosts] = useState<DataPosts[]>([])
	console.log(posts)
	const [cursor, setCursor] = useState('')
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
			console.log(data.getPosts.posts)
      setPosts((prevPosts) => [...prevPosts, ...data.getPosts.posts]);
			setCursor(data.getPosts.cursor)
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
		}
		setLoadingMore(false)
	}

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

				{loadingMore && <p>Cargando más...</p>}
				{posts.length >= 1 && (
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

export default Home
