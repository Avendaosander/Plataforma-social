"use client"

import { PlusIcon } from "@/icons"
import Badge from "@/components/profile/Badge"
import Button from "@/ui/Button"
import CardPost from "@/ui/CardPost"
import React, { useState } from "react"
import EditProfile from "@/components/profile/EditProfile"
import InfoProfile from "@/app/components/profile/InfoProfile"
import { useQuery } from "@apollo/client"
import { GET_USER } from "@/graphql/users"
import { useSession } from "next-auth/react"

function MyProfile() {
	const [isEditMode, setIsEditMode] = useState(false)
  const {data: session, status} = useSession()
  const { loading, error, data } = useQuery(GET_USER, {
		variables: {
			id: session?.user.id
		}
	});

	// console.log(data)

	const handleEditMode = (state: boolean) => {
		setIsEditMode(state)
	}

	return (
		<>
			<section className='flex gap-5'>
				<InfoProfile handleEditMode={handleEditMode} user={data?.getUser}/>
			</section>
			<Badge />
			<section className='flex flex-col gap-5 w-full items-center'>
				<CardPost />
				<CardPost />
			</section>
      {isEditMode&&(
        <div className="absolute top-0 bottom-0 left-0 right-0 bg-black/50 flex justify-center items-center">
          <EditProfile onClose={handleEditMode} user={data?.getUser}/>
        </div>
      )}
			<Button
				className='fixed bottom-5 right-5 px-3'
				startContent={<PlusIcon />}
			>
				Crear
			</Button>
		</>
	)
}

export default MyProfile
