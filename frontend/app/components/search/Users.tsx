import { GET_USERS } from "@/app/lib/graphql/users"
import { arrayToFilterObject } from "@/app/lib/logic"
import { GetUserProfile, GetUsers } from "@/app/lib/types/typesGraphql"
import { useFilterSearchStore } from "@/app/store/filterSearch"
import { useQuery } from "@apollo/client"
import Image from "next/image"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import Button from "../ui/Button"

interface PropsUsersFiltered {
	search: string
	rating: number | null
}

function Users({ search, rating }: PropsUsersFiltered) {
	const filterSearh = useFilterSearchStore(state => state.filterSearh)
	const filterObject = arrayToFilterObject(filterSearh.filter, search, rating)
	const { data, loading, error, fetchMore } = useQuery<GetUsers>(GET_USERS, {
		variables: {
			filter: filterObject,
		}
	})
  
	const [users, setUsers] = useState<GetUserProfile[]>([])
	const [cursor, setCursor] = useState('')
	const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
		if (data?.getUsers) {
      setUsers(data.getUsers.users);
			setCursor(data.getUsers.cursor)
			setHasMore(data.getUsers.hasMore)
		}
	}, [data])

	const moreUsers = async () => {
		setLoadingMore(true)
		const res = await fetchMore({
			variables: {
        filter: filterObject,
				cursor,
				take: 5
			}
		})

		if (res.data.getUsers) {
			setUsers(prevUsers => prevUsers.concat(res.data.getUsers.users))
			setCursor(res.data.getUsers.cursor)
			setHasMore(res.data.getUsers.hasMore)
		}
		setLoadingMore(false)
	}

	return (
    <>
      {users.map(user => (
        <Link
          href={`/home/profile/${user.id}`}
          key={user.id}
          className='flex gap-5 items-center p-3 w-full max-w-xl rounded-2xl ring-1 ring-seagreen-900 bg-white dark:bg-transparent dark:ring-white'
        >
          <div>
            <Image
              src={
                user.avatar
                  ? `${process.env.NEXT_PUBLIC_API_ROUTE_AVATAR}${user.avatar}`
                  : "/User.png"
              }
              alt={user.username}
              width={50}
              height={50}
            />
          </div>
          <div className='flex flex-col'>
            <p className='font-semibold'>{user.username}</p>
            <div className='flex gap-5'>
              <p className='font-light text-sm'>
                <span className='font-semibold'>{user._count.following} </span>
                Seguidores
              </p>
              <p className='font-light text-sm'>
                <span className='font-semibold'>{user._count.Post} </span>
                Componentes
              </p>
            </div>
            <p className='text-sm'>{user.description}</p>
          </div>
        </Link>
      ))}
			{loadingMore && <p className="py-2">Cargando más...</p>}
			{(!loadingMore && users.length >= 1 && hasMore) && (
				<Button
					className='px-3'
					variant="flat"
					onClick={() => moreUsers()}
				>
					Cargar mas usuarios
				</Button>
			)}
    </>
	)
}

export default Users
