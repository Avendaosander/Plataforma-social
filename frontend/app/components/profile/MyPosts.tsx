'use client'
import { GET_POSTS_USER } from '@/app/lib/graphql/posts'
import { DataPosts, GetPostsUser } from '@/app/lib/types/typesGraphql'
import { useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import CardPost from '../ui/CardPost'
import Button from '../ui/Button'

function MyPosts({idUser}: {idUser: string}) {
  const {
		data,
		loading,
		error,
		fetchMore
	} = useQuery<GetPostsUser>(GET_POSTS_USER, {
		variables: {
			idUser: idUser
		},
    fetchPolicy: 'cache-and-network'
	})
    
	const [posts, setPosts] = useState<DataPosts[]>([])
	const [cursor, setCursor] = useState('')
	const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

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
      setPosts((prevPosts) => [...prevPosts, ...data.getPostsUser.posts]);
			setCursor(data.getPostsUser.cursor)
			setHasMore(data.getPostsUser.hasMore)
		}
	}, [data])

	const morePosts = async () => {
		setLoadingMore(true)
		const res = await fetchMore({
			variables: {
				cursor,
				take: 5
			}
		})

		if (res.data.getPostsUser) {
			setPosts(prevPosts => prevPosts.concat(res.data.getPostsUser.posts))
			setCursor(res.data.getPostsUser.cursor)
			setHasMore(res.data.getPostsUser.hasMore)
		}
		setLoadingMore(false)
	}
  
  return (
    <section className='flex flex-col gap-5  w-full items-center'>
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
			{loadingMore && <p className="py-2">Cargando más...</p>}
			{(!loadingMore && posts.length >= 1 && hasMore) && (
				<Button
					className='px-3'
					variant="flat"
					onClick={() => morePosts()}
				>
					Cargar mas componentes
				</Button>
			)}
    </section>
  )
}

export default MyPosts