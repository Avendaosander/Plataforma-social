import React, { useEffect, useState } from 'react'
import CardPost from '../ui/CardPost'
import { DataPosts, GetPostsFilter } from '@/app/lib/types/typesGraphql'
import { useQuery } from '@apollo/client'
import { GET_POSTS_FILTER } from '@/app/lib/graphql/posts'
import { arrayToFilterObject } from '@/app/lib/logic'
import { useFilterSearchStore } from '@/app/store/filterSearch'

interface PropsPostsFiltered {
  search: string
  rating: number | null
}

function PostsFiltered({ search, rating }: PropsPostsFiltered) {
	const filterSearh = useFilterSearchStore(state => state.filterSearh)
	const filterObject = arrayToFilterObject(filterSearh.filter, search, rating)
  const { data, loading, error, refetch } = useQuery<GetPostsFilter>(
		GET_POSTS_FILTER,
		{
			variables: {
				filter: filterObject
			}
		}
	)
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
		if (data?.getPostsFilter) {
			setPosts(data?.getPostsFilter)
		}
	}, [data])

  return (
    posts.map(post => (
      <CardPost
        key={post.id}
        post={post}
        handleFollowing={handleFollowing}
        handleSaved={handleSaved}
      />
    ))
  )
}

export default PostsFiltered