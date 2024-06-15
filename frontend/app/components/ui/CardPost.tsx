"use client"

import React, { useState } from "react"
import UserIcon from "../icons/UserIcon"
import Button from "./Button"
import Image from "next/image"
import StarIcon from "../icons/StarIcon"
import MessageIcon from "../icons/MessageIcon"
import ShareIcon from "../icons/ShareIcon"
import BookmarkPlusIcon from "../icons/BookmarkPlusIcon"
import Link from "next/link"

function truncateText(text: string, maxLength: number) {
	if (text.length <= maxLength) {
		return text
	}
	return text.slice(0, maxLength - 3) + "..."
}

function CardPost() {
	const [isFollowing, setIsFollowing] = useState(false)
	const handleFollowing = () => {
		setIsFollowing(!isFollowing)
	}
	return (
		<article className='flex flex-col gap-3 p-3 w-full max-w-3xl rounded-2xl ring-1 ring-seagreen-900 bg-white dark:bg-transparent dark:ring-white'>
			<header className='flex justify-between items-center'>
				<div className='flex gap-2 items-center'>
					<Link href={'/home/profile/123'} className="flex gap-2 items-center">
						<UserIcon className='size-5' />
						<p className='text-lg font-medium'>Username</p>
					</Link>
          {isFollowing ? (
            <Button
              variant='solid'
              color='primary'
              shape='md'
              size='md'
              className='px-3 py-0.5'
              onClick={handleFollowing}
            >
              Siguiendo
            </Button>
          ):(
            <Button
              variant='outline'
              color='primary'
              shape='md'
              size='md'
              className='px-3 py-0.5 dark:bg-inherit dark:ring-white dark:text-white'
              onClick={handleFollowing}
            >
              Seguir
            </Button>
          )}
				</div>
				<span className='opacity-75'>18hrs</span>
			</header>
			<Link href={'/home/post'}>
				<h3 className='text-lg font-bold px-2'>Titulo</h3>
			</Link>
			<div className='flex justify-between gap-3'>
				<div className='flex flex-col gap-3 h-full justify-between'>
					<p className='text-lg max-w-[50ch] px-2'>
						{truncateText(
							"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex asperiores iste laudantium nostrum ad, molestiae hic nihil sint eveniet odit rerum voluptatibus reprehenderit reiciendis magnam consequuntur quaerat harum vel quos at amet vitae ullam sunt. Fuga aspernatur molestias consequatur nihil natus beatae dignissimos, autem excepturi perspiciatis quod distinctio, expedita veniam molestiae? Odio aliquid porro magni unde quae laboriosam aperiam minima reprehenderit neque earum eligendi, rem sunt? Veniam error quasi, aliquid ex nesciunt reiciendis recusandae ipsum quam neque velit consequatur architecto!",
							290
						)}
					</p>
					<div className='flex text-start gap-2 p-2 '>
						<Link href={'/home/search?tech=tecnologia'}>
							<Button
								variant='flat'
								color='secondary'
								shape='full'
								size='sm'
								marginX='none'
								className='px-3 py-0.5'
								>
								Tecnologia
							</Button>
						</Link>
						<Link href={'/home/search?tech=tecnologia'}>
							<Button
								variant='flat'
								color='secondary'
								shape='full'
								size='sm'
								marginX='none'
								className='px-3 py-0.5'
								>
								Tecnologia
							</Button>
						</Link>
						<Link href={'/home/search?tech=tecnologia'}>
							<Button
								variant='flat'
								color='secondary'
								shape='full'
								size='sm'
								marginX='none'
								className='px-3 py-0.5'
								>
								Tecnologia
							</Button>
						</Link>
						<Link href={'/home/search?tech=tecnologia'}>
							<Button
								variant='flat'
								color='secondary'
								shape='full'
								size='sm'
								marginX='none'
								className='px-3 py-0.5'
								>
								Tecnologia
							</Button>
						</Link>
					</div>
				</div>
				<div className='flex flex-col items-center gap-3 h-full justify-between'>
					<div className='p-6'>
						<Image
							src={"/LogoUVM.jpg"}
							alt='Imagen Componente'
							width={120}
							height={120}
						/>
					</div>
					<div className='p-2'>
						<Button
							variant='flat'
							color='secondary'
							shape='full'
							size='sm'
							className='px-3 py-0.5'
						>
							Vista Previa
						</Button>
					</div>
				</div>
			</div>
			<footer className='border-t border-seagreen-950/40 dark:border-white/40 flex justify-between px-3 pt-3'>
				<div className='flex gap-1 items-center'>
					<div className='flex gap-1'>
						<StarIcon className='size-5 fill-yellow-400 stroke-yellow-400' />
						<StarIcon className='size-5 fill-yellow-400 stroke-yellow-400' />
						<StarIcon className='size-5 fill-yellow-400 stroke-yellow-400' />
						<StarIcon className='size-5 ' />
						<StarIcon className='size-5 ' />
					</div>
					<p className='font-light'>3.2</p>
				</div>
				<div className='flex gap-1 items-center'>
					<MessageIcon className='size-5' />
					<p className='font-light'>12</p>
				</div>
				<ShareIcon className='size-5' />
				<BookmarkPlusIcon className='size-5' />
			</footer>
		</article>
	)
}

export default CardPost
