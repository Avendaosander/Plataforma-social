'use client'
import { GET_POSTS_USER } from '@/app/lib/graphql/posts'
import { DataPosts, GetPostsUser } from '@/app/lib/types/typesGraphql'
import { useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import CardPost from '../ui/CardPost'

function MyPosts({idUser}: {idUser: string}) {
  const {
		data,
		loading,
		error
	} = useQuery<GetPostsUser>(GET_POSTS_USER, {
		variables: {
			idUser: idUser
		},
    fetchPolicy: 'cache-and-network'
	})
    
	const [posts, setPosts] = useState<DataPosts[]>([])

  const handleFollowing = (idUser: string, isFollowing: boolean) => {
		setPosts(prevPosts => 
			prevPosts.map(post =>
				post.user.id === idUser ? { ...post, isFollowing } : post
			)
		)
	}

	const handleSaved = (idPost: string, isSaved: boolean, saved: number) => {
		setPosts(prevPosts => 
			prevPosts.map(post =>
				post.id === idPost ? { ...post, isSaved, saved } : post
			)
		)
	}

	useEffect(() => {
		if (data?.getPostsUser) {
			setPosts(data?.getPostsUser)
		}
	}, [data])
  
  return (
    <section className='flex flex-col gap-5 w-full items-center'>
      {posts?.length == 0 ? (
        <div>
          <p>No hay componentes aun</p>
        </div>
      ):(
        posts?.map(post => (
          <CardPost
            key={post.id}
            post={post}
            hiddenButton={true}
            handleFollowing={handleFollowing}
            handleSaved={handleSaved}
          />
        ))
      )}
    </section>
  )
}

export default MyPosts