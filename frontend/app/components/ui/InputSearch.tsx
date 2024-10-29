'use client'
import React, { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { SearchIcon } from '@/icons'
import InputWithIcon from './InputWithIcon'

function InputSearch() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState('')

  const handleSearch = (term: string) => {
    setSearch(term)
    const params = new URLSearchParams(searchParams)

    if (term) {
      params.set('query', term)
    } else {
      params.delete('query')
    }

    router.replace(`${pathname}?${params.toString()}`)
  }

  const handleSubmit = () => {
    const params = new URLSearchParams(searchParams)

    if (pathname === '/home/search') {
      router.push(`${pathname}?${params.toString()}`)
    } else {
      router.push(`${process.env.NEXT_PUBLIC_URL}home/search?${params.toString()}`)
    }
  }

  useEffect(() => {
    setSearch(searchParams.get('query')?.toString() as string)
  }, [searchParams])
  
  return (
    <InputWithIcon
      text={search}
      setText={setSearch}
      type='text'
      placeholder='Buscar'
      name='Search'
      value={search}
      handleChange={handleSearch}
      onSubmit={handleSubmit}
      endContent={<SearchIcon className='size-5'/>}
    />
  )
}

export default InputSearch