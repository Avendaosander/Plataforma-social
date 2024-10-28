'use client'
import { DataPostSaved, GetPostsSaved } from '@/app/lib/types/typesGraphql'
import { useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import CardPost from '../ui/CardPost'
import { GET_POSTS_SAVED } from '@/app/lib/graphql/posts_saveds'
import Button from '../ui/Button'

function PostsSaved({idUser}: {idUser: string}) {
  const {
		data,
		loading,
		error,
		fetchMore
	} = useQuery<GetPostsSaved>(GET_POSTS_SAVED, {
		variables: {
			idUser: idUser
		},
    fetchPolicy: "cache-and-network"
	})

	const [posts, setPosts] = useState<DataPostSaved[]>([])
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
				post.idPost === idPost ? { ...post, post: {...post.post, isSaved, saved } } : post
			)
		)
	}

	useEffect(() => {
		if (data?.getPostsSaved) {
      setPosts((prevPosts) => [...prevPosts, ...data.getPostsSaved.posts]);
			setCursor(data.getPostsSaved.cursor)
			setHasMore(data.getPostsSaved.hasMore)
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

		if (res.data.getPostsSaved) {
			setPosts(prevPosts => prevPosts.concat(res.data.getPostsSaved.posts))
			setCursor(res.data.getPostsSaved.cursor)
			setHasMore(res.data.getPostsSaved.hasMore)
		}
		setLoadingMore(false)
	}

	console.log(posts)
  
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

export default PostsSaved