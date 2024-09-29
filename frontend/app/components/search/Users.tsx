import { GET_USERS } from '@/app/lib/graphql/users'
import { GetUsers } from '@/app/lib/types/typesGraphql'
import { useQuery } from '@apollo/client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Users() {
  const {data: users, loading, error} = useQuery<GetUsers>(GET_USERS)

  return (
    users && users.getUsers.map(user => (
      <Link href={`/home/profile/${user.id}`} key={user.id} className='flex gap-5 items-center p-3 w-full max-w-xl rounded-2xl ring-1 ring-seagreen-900 bg-white dark:bg-transparent dark:ring-white'>
        <div>
          <Image
            src={`${process.env.NEXT_PUBLIC_API_ROUTE_AVATAR}${user.avatar}` || '/User.png'}
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
    ))
  )
}

export default Users