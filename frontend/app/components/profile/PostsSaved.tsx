'use client'
import { GetPostsSaved } from '@/app/lib/types/typesGraphql'
import { useQuery } from '@apollo/client'
import React from 'react'
import CardPost from '../ui/CardPost'
import { GET_POSTS_SAVED } from '@/app/lib/graphql/posts_saveds'

function PostsSaved({idUser}: {idUser: string}) {
  const {
		data: posts,
		loading,
		error
	} = useQuery<GetPostsSaved>(GET_POSTS_SAVED, {
		variables: {
			idUser: idUser
		}
	})
  
  return (
    <section className='flex flex-col gap-5 w-full items-center'>
      {posts?.getPostsSaved.length == 0 ? (
        <div>
          <p>No hay componentes guardados aun</p>
        </div>
      ):(
        posts?.getPostsSaved?.map(post => (
          <CardPost
            key={post.post.id}
            post={post.post}
            hiddenButton={true}
          />
        ))
      )}
    </section>
  )
}

export default PostsSaved