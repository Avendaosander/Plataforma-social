import React, { useEffect, useState } from 'react'
import CardPost from '../ui/CardPost'
import { DataPosts, GetPostsFilter } from '@/app/lib/types/typesGraphql'
import { useQuery } from '@apollo/client'
import { GET_POSTS_FILTER } from '@/app/lib/graphql/posts'
import { arrayToFilterObject } from '@/app/lib/logic'
import { useFilterSearchStore } from '@/app/store/filterSearch'
import Button from '../ui/Button'

interface PropsPostsFiltered {
  search: string
  rating: number | null
}

function PostsFiltered({ search, rating }: PropsPostsFiltered) {
	const filterSearh = useFilterSearchStore(state => state.filterSearh)
	const filterObject = arrayToFilterObject(filterSearh.filter, search, rating)
	console.log('filter: ', filterObject)
  const { data, loading, error, fetchMore } = useQuery<GetPostsFilter>(
		GET_POSTS_FILTER,
		{
			variables: {
				filter: filterObject,
				cursor: null,
				take: 5
			}
		}
	)
	const [posts, setPosts] = useState<DataPosts[]>([])
	const [cursor, setCursor] = useState('')
	const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false);

  console.log(data?.getPostsFilter.posts)
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
		if (data?.getPostsFilter) {
      setPosts(data.getPostsFilter.posts);
			setCursor(data.getPostsFilter.cursor)
			setHasMore(data.getPostsFilter.hasMore)
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

		if (res.data.getPostsFilter) {
			setPosts(prevPosts => prevPosts.concat(res.data.getPostsFilter.posts))
			setCursor(res.data.getPostsFilter.cursor)
			setHasMore(res.data.getPostsFilter.hasMore)
		}
		setLoadingMore(false)
	}

  return (
		<>
			{posts.map(post => (
				<CardPost
					key={post.id}
					post={post}
					handleFollowing={handleFollowing}
					handleSaved={handleSaved}
				/>
			))}
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
		</>
  )
}

export default PostsFiltered