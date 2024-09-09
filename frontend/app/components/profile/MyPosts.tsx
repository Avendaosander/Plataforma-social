'use client'
import { GET_POSTS_USER } from '@/app/lib/graphql/posts'
import { GetPostsUser } from '@/app/lib/types/typesGraphql'
import { useQuery } from '@apollo/client'
import React from 'react'
import CardPost from '../ui/CardPost'

function MyPosts({idUser}: {idUser: string}) {
  const {
		data: posts,
		loading,
		error
	} = useQuery<GetPostsUser>(GET_POSTS_USER, {
		variables: {
			idUser: idUser
		}
	})
  return (
    <section className='flex flex-col gap-5 w-full items-center'>
      {posts?.getPostsUser.length == 0 ? (
        <div>
          <p>No hay componentes aun</p>
        </div>
      ):(
        posts?.getPostsUser?.map(post => (
          <CardPost
            key={post.id}
            post={post}
            hiddenButton={true}
          />
        ))
      )}
    </section>
  )
}

export default MyPosts