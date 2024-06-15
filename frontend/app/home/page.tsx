'use client'
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Button from "@/components/ui/Button"
import { PlusIcon, SearchIcon } from "@/icons/icons"
import InputWithIcon from "@/components/ui/InputWithIcon"
import CardPost from "@/components/ui/CardPost"

function Home() {
  const [searchText, setSearchText] = useState('')
  const router = useRouter();

  const handleSubmit = () =>{  
    router.push(`/home/search?query=${encodeURIComponent(searchText)}`);
  }

	return (
		<>
			<section className='flex flex-col items-center w-full gap-5'>
				<InputWithIcon
					type='text'
					placeholder='Buscar'
          value={searchText}
          onChange={e=>setSearchText(e.target.value)}
					endContent={<SearchIcon className='size-5' />}
          onSubmit={handleSubmit}
				/>
				<CardPost/>
				<CardPost/>
				<CardPost/>
				<CardPost/>
			</section>
			<Button
				className='fixed bottom-5 right-5 px-3'
				startContent={<PlusIcon />}
			>
				Crear
			</Button>
		</>
	)
}

export default Home
