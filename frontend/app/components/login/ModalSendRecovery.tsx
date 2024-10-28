'use client'
import { gql, useMutation } from '@apollo/client';
import React, { useState } from 'react'
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useRouter } from 'next/navigation';
import XIcon from '../icons/XIcon';
import { toastCustom } from '../ui/toasts';
import { SEND_EMAIL_CODE } from '@/app/lib/graphql/recovery';
import { SendEmailCode } from '@/app/lib/types/typesGraphql';

function ModalSendRecovery({ onClose }: {onClose: (value: boolean)=> void}) {
  const [email, setEmail] = useState("")
  const [sendEmail, {error, reset}] = useMutation<SendEmailCode>(SEND_EMAIL_CODE)

  const handleSendEmail = async () => {
    const res = await sendEmail({ variables: { email } });
    if (res.data?.sendRecoveryCode.response === 'OK') {
      toastCustom({text: 'Se ha enviado un mensaje a tu correo electronico', variant: 'info', duration:8000})
      onClose(false)
    }
    reset()
  }

  if (error) {
    toastCustom({text: 'Hubo un error', variant: 'error', duration:3000})
    reset()
  }

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 bg-black/50 max-h-screen flex justify-center items-center'>
		  <section className='flex flex-col bg-storm-50 dark:bg-storm-950 rounded-xl max-w-md w-full'>
        <header className='flex justify-between items-center p-5 border-b border-seagreen-950/40 dark:border-white/20'>
          <h3 className='text-2xl font-semibold'>Correo de confirmacion</h3>
          <button onClick={() => onClose(false)}>
            <XIcon />
          </button>
        </header>
			  <div className='flex flex-col gap-5 p-5'>
          <div className="flex flex-col gap-1">
            <label htmlFor='email'>Correo Electronico</label>
            <Input
              type="email"
              placeholder="Ingresa tu correo"
              id='email'
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="font-light text-sm">Le sera enviado un codigo de verificacion a su correo electronico y continuar desde el enlace enviado.</p>
          </div>
          <Button
            type='submit'
            color='primary'
            variant='solid'
            size='lg'
            marginX='auto'
            shape='md'
            onClick={handleSendEmail}
          >
            Enviar correo
          </Button>
        </div>

      </section>
    </div>
  )
}

export default ModalSendRecovery