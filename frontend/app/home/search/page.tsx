'use client'
import React, { useState } from "react"
import { PlusIcon } from "@/icons/icons"
import Button from "@/ui/Button"
import CardPost from "@/ui/CardPost"
import InputSearch from "@/app/components/ui/InputSearch"
import Link from "next/link"
import { useQuery } from "@apollo/client"
import { GetFollower, GetPosts } from "@/app/lib/types/typesGraphql"
import { GET_POSTS } from "@/app/lib/graphql/posts"
import { useUserStore } from "@/app/store/user"
import { GET_FOLLOWERS } from "@/app/lib/graphql/followers"

function Search({
  searchParams
}: {
  searchParams?: {
    query?: string,
  }
}) {
	const { data: posts, loading, error } = useQuery<GetPosts>(GET_POSTS)
	const { user } = useUserStore(state => state)
	const { data: followers } = useQuery<GetFollower>(GET_FOLLOWERS, {
    variables: {
      idFollower: user.id
    }
  })
  const [isFilterActive, setIsFilterActive] = useState(false)
  // console.log(searchParams)

  const handleFilterState = () => {
    setIsFilterActive(!isFilterActive)
  }

	return (
		<>
			<section className='flex flex-col items-center w-full gap-5'>
				<InputSearch/>
        {followers?.getFollowers && posts?.getPosts.map(post => (
          <CardPost key={post.id} post={post} following={followers.getFollowers.some(follower => follower.idFollowing == post.user.id)}/>
        ))}
			</section>
      <section className={`fixed top-0 right-0 h-screen max-w-[250px] flex flex-col justify-between items-center py-5 px-5 gap-2`}>
        <Button
          className='px-3 ml-auto'
          color={`${isFilterActive ? 'secondary' : 'primary'}`}
          startContent={<PlusIcon />}
          onClick={handleFilterState}
        >
          Filtrar
        </Button>
        <div className={`${isFilterActive ? 'w-[250px] h-full flex flex-col items-center bg-seagreen-900 rounded-l-xl text-white p-3 gap-5' : ''}`}>
          {isFilterActive&&(
            <>
              <p className="text-lg font-medium">Tecnologias</p>
              <select name="tech" id="tech" defaultValue={'default'} className="bg-storm-50 px-3 py-1 rounded-lg ring-1 ring-seagreen-950 text-seagreen-950 outline-none w-full">
                <option value="default" disabled>-- Selecione --</option>
                <option value="React">React</option>
              </select>
              <p className="text-lg font-medium">Categorias</p>
              <p className="text-lg font-medium">Calificacion</p>
            </>
          )}
        </div>
        <Link href={'/home/create'} className="ml-auto">
          <Button
            className='px-3'
            startContent={<PlusIcon />}
          >
            Crear
          </Button>
        </Link>
      </section>
		</>
	)
}

export default Search
