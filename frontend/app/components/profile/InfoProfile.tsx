"use client"
import Image from "next/image"
import React, { useState } from "react"
import Button from "@/ui/Button"
import { EditIcon, ShareRightIcon } from "@/icons"
import { DeleteFollower, GetUserProfile, PostFollower } from "@/typesGraphql"
import { useMutation, useQuery } from "@apollo/client"
import {
	DELETE_FOLLOWER,
	GET_FOLLOWERS,
	POST_FOLLOWER
} from "@/app/lib/graphql/followers"
import { GET_USER } from "@/app/lib/graphql/users"
import { useSession } from "next-auth/react"
import ShareModal from "../ui/ShareModal"

interface PropsInfo {
	handleEditMode: (state: boolean) => any
	user: GetUserProfile
	isMyProfile: boolean
	following: boolean
}

function InfoProfile({
	handleEditMode,
	user,
	isMyProfile,
	following
}: PropsInfo) {
	const avatar = user?.avatar
		? `${process.env.NEXT_PUBLIC_API_ROUTE_AVATAR}${user.avatar}`
		: "/User.png"
	const [isFollowing, setIsFollowing] = useState(following)
	const { data: sessionData } = useSession()
	const idUser = localStorage.getItem("idUser")
	const [isShareModalOpen, setIsShareModalOpen] = useState(false)
	const shareUrl = `${process.env.NEXT_PUBLIC_URL}home/profile/${idUser}`

	const { refetch: refetchGetfollowers } = useQuery(GET_FOLLOWERS, {
		variables: { idFollower: idUser },
		skip: true
	})
	const { refetch: refetchGetUser } = useQuery(GET_USER, {
		variables: { id: idUser },
		skip: true
	})
	const { refetch: refetchGetUserFollow } = useQuery(GET_USER, {
		variables: { id: user.id },
		skip: true
	})

	const [postFollower, { data: dataFollowing, error: errorFollowing }] =
		useMutation<PostFollower>(POST_FOLLOWER)
	const [deleteFollower, { data: unfollowing, error: errorUnfollowing }] =
		useMutation<DeleteFollower>(DELETE_FOLLOWER)

	const handleFollowing = async () => {
		if (isFollowing) {
			const res = await deleteFollower({
				variables: {
					idFollower: sessionData?.user.id,
					idFollowing: user.id
				}
			})

			if (res.data?.deleteFollower) {
				setIsFollowing(false)
				refetchGetfollowers()
				refetchGetUser()
				refetchGetUserFollow()
			}
		} else {
			const res = await postFollower({
				variables: {
					idFollower: sessionData?.user.id,
					idFollowing: user.id
				}
			})

			if (res.data?.postFollower) {
				setIsFollowing(true)
				refetchGetfollowers()
				refetchGetUser()
				refetchGetUserFollow()
			}
		}
	}

	return (
		<div className="flex flex-col md:flex-row items-center md:gap-10">
			<Image
				src={avatar}
				alt='Avatar'
				width={120}
				height={120}
				className='aspect-square size-[120px]'
			/>
			<div className='flex flex-col gap-5'>
				<div className='flex flex-col md:flex-row items-center gap-2 md:gap-6'>
					<h2 className='text-lg font-semibold'>{user?.username}</h2>
					<div className="flex gap-2 md:gap-6">
						{isMyProfile ? (
							<Button
								color='primary'
								variant='outline'
								shape='sm'
								className='px-5 py-1'
								startContent={<EditIcon />}
								onClick={() => {
									handleEditMode(true)
								}}
							>
								Editar Perfil
							</Button>
						) : (
							<Button
								color='primary'
								variant={isFollowing ? "solid" : "outline"}
								shape='sm'
								className='px-5 py-1'
								onClick={() => {
									handleFollowing()
								}}
							>
								{isFollowing ? "Siguiendo" : "Seguir"}
							</Button>
						)}
						<Button
							color='primary'
							variant='outline'
							shape='sm'
							className='px-1 py-1'
							onClick={() => setIsShareModalOpen(true)}
							startContent={<ShareRightIcon />}
						></Button>
					</div>
				</div>
				<div className="flex flex-col-reverse md:flex-col gap-5">
					<div className='flex gap-6'>
						<p className="flex flex-col md:flex-row items-center md:gap-2">
							<span className='font-semibold'>{user._count.following}</span>{" "}
							Seguidores
						</p>
						<p className="flex flex-col md:flex-row items-center md:gap-2">
							<span className='font-semibold'>{user._count.followers}</span>{" "}
							Seguidos
						</p>
						<p className="flex flex-col md:flex-row items-center md:gap-2">
							<span className='font-semibold'>{user._count.Post}</span>{" "}
							Componentes
						</p>
					</div>
					<p className='max-w-[60ch]'>{user?.description}</p>
				</div>
			</div>
			{isShareModalOpen && (
				<ShareModal
					onClose={() => setIsShareModalOpen(false)}
					shareUrl={shareUrl}
				/>
			)}
		</div>
	)
}

export default InfoProfile
