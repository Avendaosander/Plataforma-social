'use client'
import React from "react"
import Button from "@/ui/Button"
import { PlusIcon } from "@/icons"
import CardPost from "@/ui/CardPost"
import InputSearch from "@/ui/InputSearch"
import Link from "next/link"
import { useQuery } from "@apollo/client"
import { GET_POSTS } from "../lib/graphql/posts"
import { GetFollower, GetPosts } from "../lib/types/typesGraphql"
import { useUserStore } from "../store/user"
import { GET_FOLLOWERS } from "../lib/graphql/followers"

function Home() {
	const { data: posts, loading, error } = useQuery<GetPosts>(GET_POSTS)
	const { user } = useUserStore(state => state)
	const { data: followers } = useQuery<GetFollower>(GET_FOLLOWERS, {
    variables: {
      idFollower: user.id
    }
  })

	return (
		<>
			<section className='flex flex-col h-full items-center w-full gap-5'>
				<InputSearch/>
				{followers?.getFollowers && (
					posts?.getPosts.map(post => (
						<CardPost key={post.id} post={post} following={followers?.getFollowers.some(follower => follower.idFollowing == post.user.id) || false}/>
					))
				)}
			</section>
			<Link href={'/home/create'}>
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
