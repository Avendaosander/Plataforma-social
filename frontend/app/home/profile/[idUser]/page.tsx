"use client"

import React, { useState } from "react"
import { useUserStore } from "@/app/store/user"
import Button from "@/ui/Button"
import Badge from "@/components/profile/Badge"
import EditProfile from "@/components/profile/EditProfile"
import InfoProfile from "@/components/profile/InfoProfile"
import { PlusIcon } from "@/icons"
import Link from "next/link"
import {
	DataUserProfile,
	GetFollower,
} from "@/app/lib/types/typesGraphql"
import { useQuery } from "@apollo/client"
import { GET_USER } from "@/app/lib/graphql/users"
import { GET_FOLLOWERS } from "@/app/lib/graphql/followers"
import MyPosts from "@/app/components/profile/MyPosts"
import { useSearchParams } from "next/navigation"
import PostsSaved from "@/app/components/profile/PostsSaved"

const FILTERS = {
	myPosts: 'myPosts',
	postsSaved: 'postsSaved'
}
function Profile({ params }: { params: { idUser: string } }) {
	const idUser = useUserStore(state => state.user.id)
  const searchParams = useSearchParams()
	const {
		data: user,
		loading: loadingUser,
		error: errorUser
	} = useQuery<DataUserProfile>(GET_USER, {
		variables: {
			id: params.idUser
		},
		fetchPolicy: "network-only"
	})

	const { data: followers, loading: loadingFollowers } = useQuery<GetFollower>(GET_FOLLOWERS, {
		variables: {
			idFollower: idUser
		}
	})

	const [isEditMode, setIsEditMode] = useState(false)

	const filter = searchParams.get('filter')?.toString()
	const isMyProfile = user?.getUser.id === idUser
	const isFollowing = followers?.getFollowers.some(
		follower => follower.idFollowing == user?.getUser.id
	) || false

	const handleEditMode = (state: boolean) => {
		setIsEditMode(state)
	}

	return (
		user && (
			<>
				<section className='flex gap-5'>
					{followers?.getFollowers && (
						<InfoProfile
							handleEditMode={handleEditMode}
							user={user.getUser}
							isMyProfile={isMyProfile}
							following={isFollowing}
						/>
					)}
				</section>
				<Badge isMyProfile={isMyProfile}/>
				{filter === FILTERS.postsSaved ? (
					<PostsSaved idUser={params.idUser}/>
				): (
					<MyPosts idUser={params.idUser}/>
				)}
				{isEditMode && (
					<div className='absolute top-0 bottom-0 left-0 right-0 bg-black/50 flex justify-center items-center z-10'>
						<EditProfile
							onClose={handleEditMode}
							user={user.getUser}
						/>
					</div>
				)}
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
	)
}

export default Profile
