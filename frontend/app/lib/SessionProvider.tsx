'use client'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import React, { useEffect } from 'react'

function SessionProvider({children}: React.PropsWithChildren) {
  const {data, status} = useSession()
  // console.log(data)

  useEffect(() => {
    if (!data && status !== 'loading') {
      redirect('/login');
    }
  }, [data, status]);
  
  return (
    <div>{children}</div>
  )
}

export default SessionProvider