import React from 'react'
import { ComponentsIcon, BookmarksIcon} from '@/icons/icons'

function Badge() {
  return (
    <section className='w-full max-w-5xl flex justify-center border-t border-seagreen-900/40 dark:border-white/40'>
      <div className='flex gap-10'>
        <button className='flex items-center gap-2 p-2 border-t-2 border-lima-400'>
          <ComponentsIcon/>
          Componentes
        </button>
        <button className='flex items-center gap-2 p-2'>
          <BookmarksIcon/>
          Guardados
        </button>
      </div>
    </section>
  )
}

export default Badge