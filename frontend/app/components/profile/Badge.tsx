'use client'
import React from 'react'
import { ComponentsIcon, BookmarksIcon} from '@/icons/icons'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

function Badge({isMyProfile}: {isMyProfile: boolean}) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleFilter = (term: string|null) => {
    const params = new URLSearchParams(searchParams)

    if (term) {
      params.set('filter', term)
    } else {
      params.delete('filter')
    }

    router.replace(`${pathname}?${params.toString()}`)
  }

  const isActiveClasses = `border-t-2 border-lima-400`
	const filter = searchParams.get('filter')?.toString()

  return (
    <section className='w-full max-w-5xl flex justify-center border-t border-seagreen-900/40 dark:border-white/40'>
      <div className='flex gap-10'>
        <button className={`flex items-center gap-2 p-2 ${filter ?? isActiveClasses}`} onClick={() => { handleFilter(null)}}>
          <ComponentsIcon/>
          Componentes
        </button>
        {isMyProfile && (
          <button className={`flex items-center gap-2 p-2 ${filter && isActiveClasses}`} onClick={() => { handleFilter('postsSaved')}}>
            <BookmarksIcon/>
            Guardados
          </button>
        )}
      </div>
    </section>
  )
}

export default Badge