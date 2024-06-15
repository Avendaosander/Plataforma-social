'use client'
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { PlusIcon, SearchIcon } from "@/icons/icons"
import Button from "@/ui/Button"
import InputWithIcon from "@/ui/InputWithIcon"
import CardPost from "@/ui/CardPost"

function Search() {
  const [searchText, setSearchText] = useState('')
  const [isFilterActive, setIsFilterActive] = useState(false)

  const router = useRouter();

  const handleFilterState = () => {
    setIsFilterActive(!isFilterActive)
  }

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
      <section className={`fixed top-0 right-0 h-screen max-w-[250px] flex flex-col justify-between items-center py-5 px-5 gap-2`}>
        <Button
          className='px-3'
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
              <p className="text-lg font-medium">Clasificacion</p>
            </>
          )}
        </div>
        <Button
          className='px-3'
          startContent={<PlusIcon />}
        >
          Crear
        </Button>
      </section>
		</>
	)
}

export default Search
