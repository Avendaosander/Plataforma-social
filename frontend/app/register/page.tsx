import React from 'react'
import FormRegister from '@/components/register/FormRegister'

function Register() {
  return (
    <main className='w-screen h-screen flex justify-center items-center gap-x-16'>
      <section>
        <h1 className='font-bold text-5xl mb-4'>UVM Dev House</h1>
        <p className='text-2xl max-w-[40ch]'>UVM Dev House te ayuda a encontrar y compartir componentes de desarrollo web Open Source.</p>
      </section>
      <section>
        <FormRegister/>
      </section>
    </main>
  )
}

export default Register