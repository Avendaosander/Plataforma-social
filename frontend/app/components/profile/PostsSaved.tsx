'use client'
import { DataPostSaved, GetPostsSaved } from '@/app/lib/types/typesGraphql'
import { useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import CardPost from '../ui/CardPost'
import { GET_POSTS_SAVED } from '@/app/lib/graphql/posts_saveds'

function PostsSaved({idUser}: {idUser: string}) {
  const {
		data,
		loading,
		error
	} = useQuery<GetPostsSaved>(GET_POSTS_SAVED, {
		variables: {
			idUser: idUser
		},
    fetchPolicy: "cache-and-network"
	})

	const [posts, setPosts] = useState<DataPostSaved[]>([])

  const handleFollowing = (idUser: string, isFollowing: boolean) => {
		setPosts(prevPosts => 
			prevPosts.map(post =>
				post.user.id === idUser ? { ...post, isFollowing } : post
			)
		)
	}
	console.log(posts)

	const handleSaved = (idPost: string, isSaved: boolean, saved: number) => {
		setPosts(prevPosts => 
			prevPosts.map(post =>
				post.idPost === idPost ? { ...post, post: {...post.post, isSaved, saved } } : post
			)
		)
	}

	useEffect(() => {
		if (data?.getPostsSaved) {
			setPosts(data?.getPostsSaved)
		}
	}, [data])
  
  return (
    <section className='flex flex-col gap-5 w-full items-center'>
      {posts?.length == 0 ? (
        <div>
          <p>No hay componentes guardados aun</p>
        </div>
      ):(
        posts?.map(post => (
          <CardPost
            key={post.post.id}
            post={post.post}
						hiddenButton={true}
            handleFollowing={handleFollowing}
            handleSaved={handleSaved}
          />
        ))
      )}
    </section>
  )
}

export default PostsSaved