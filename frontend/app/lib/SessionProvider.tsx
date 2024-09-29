'use client'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import React, { useEffect } from 'react'
import { useUserStore } from '@/store/user';
import { LoginClass } from '@/typesGraphql';
import { subscription } from './webpush/wp';

function SessionProvider({children}: React.PropsWithChildren) {
  const { data: sessionData, status } = useSession()

  const updateState = useUserStore(state => state.updateState)
  
  useEffect(() => {
    if (status === 'loading') return;

    if (!sessionData) {
      localStorage.removeItem('token')
      return redirect('/login');
    }
    
    if (sessionData) {
      updateState(sessionData.user as LoginClass)
      localStorage.setItem('token', sessionData.token)
      localStorage.setItem('idUser', sessionData.user.id)
    }
  }, [sessionData, status, updateState]);
  
  useEffect(() => {
    if (sessionData) {
      subscription(sessionData.user.id)
    }
  }, [])
  
  return (
    <div>{children}</div>
  )
}

export default SessionProvider