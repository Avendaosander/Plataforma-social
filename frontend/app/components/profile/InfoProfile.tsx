import Image from 'next/image'
import React from 'react'
import Button from '../ui/Button'
import { DotsIcon, EditIcon, ShareRightIcon } from '@/icons'

interface PropsInfo {
  handleEditMode: (state: boolean) => any,
  user: {
    id: string
    username: string
    description: string
    avatar: string
  }
}

function InfoProfile({ handleEditMode, user }: PropsInfo) {
  return (
    <>
      <Image
					src={user?.avatar !== "" ? user?.avatar : "/LogoUVM.jpg"}
					alt='Avatar'
					width={120}
					height={120}
					className='aspect-square size-[120px]'
				/>
				<div className='flex flex-col gap-5'>
					<div className='flex gap-6'>
						<h2 className='text-lg font-semibold'>{user?.username}</h2>
						<Button
							color='primary'
							variant='outline'
							shape='sm'
							className='px-5 py-1'
							startContent={<EditIcon />}
              onClick={()=>{handleEditMode(true)}}
						>
							Editar Perfil
						</Button>
						<Button
							color='primary'
							variant='outline'
							shape='sm'
							className='px-1 py-1'
							startContent={<ShareRightIcon />}
						></Button>
						<Button
							color='primary'
							variant='outline'
							shape='sm'
							className='px-1 py-1'
							startContent={<DotsIcon />}
						></Button>
					</div>
					<div className='flex gap-6'>
						<p>
							<span className='font-semibold'>1234</span> Seguidores
						</p>
						<p>
							<span className='font-semibold'>450</span> Seguidos
						</p>
						<p>
							<span className='font-semibold'>148</span> Componentes
						</p>
					</div>
					<p className='max-w-[60ch]'>
						{user?.description}
					</p>
				</div>
    </>
  )
}

export default InfoProfile