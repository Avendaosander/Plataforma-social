"use client"

import InputWithIcon from "@/ui/InputWithIcon"
import { DotsIcon, EditIcon, MessagePlusIcon, ShareIcon, StarIcon, TrashIcon } from "@/icons/icons"
import Button from "@/ui/Button"
import Image from "next/image"
import React, { useState } from "react"

function Post() {
	const [isMore, setIsMore] = useState(false)
	const handleMore = () => {
		setIsMore(!isMore)
	}
	return (
		<>
			<section className='flex flex-col gap-3 items-center min-h-screen max-w-3xl mr-56'>
				<h2 className='text-3xl font-semibold'>Titulo</h2>
				<div className='flex flex-col gap-3'>{/* Container */}
					<p className='px-5 max-w-[80ch]'>
						Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo,
						repellendus labore. Reprehenderit enim nihil modi voluptatibus esse
						beatae voluptas harum excepturi dignissimos laboriosam, quos impedit
						hic blanditiis veritatis necessitatibus. Quasi nihil nostrum dolor
						eius, aliquid fugiat harum architecto amet quam id consectetur
						expedita magni perspiciatis nam quae illo culpa magnam beatae
						dolorem quis consequatur velit nisi iste. Amet voluptatum est itaque
						animi veniam! Sit, explicabo. Architecto quisquam quidem repellendus
						quod facere tenetur enim neque nam eos earum, praesentium accusamus
						ut corrupti cupiditate possimus quam inventore animi, aut explicabo
						commodi fugit aliquam et voluptatibus. Odio delectus numquam tenetur
						perspiciatis at a.
					</p>
					<section className='flex gap-5 w-full'>{/* Info */}
						<Image
							src={"/LogoUVM.jpg"}
							alt='Avatar'
							width={120}
							height={120}
							className='aspect-square size-[120px]'
						/>
						<div className='flex flex-col gap-2'>{/*  */}
							<div className='flex gap-2'>
								<p className='font-semibold'>Desarrollado por:</p>
								<p>Username</p>
							</div>
							<div className='flex gap-2'>
								<p className='font-semibold'>Fecha de publicacion:</p>
								<p>17/05/2024</p>
							</div>
							<div className='flex gap-2'>
								<p className='font-semibold'>Stack:</p>
								<div className='flex flex-wrap gap-2'>
									<button className='px-2 py-0.5 rounded-lg font-semibold bg-biscay-600/80 text-white'>
										Tagname
									</button>
									<button className='px-2 py-0.5 rounded-lg font-semibold bg-biscay-600/80 text-white'>
										Tagname
									</button>
									<button className='px-2 py-0.5 rounded-lg font-semibold bg-biscay-600/80 text-white'>
										Tagname
									</button>
									<button className='px-2 py-0.5 rounded-lg font-semibold bg-biscay-600/80 text-white'>
										Tagname
									</button>
									<button className='px-2 py-0.5 rounded-lg font-semibold bg-biscay-600/80 text-white'>
										Tagname
									</button>
									<button className='px-2 py-0.5 rounded-lg font-semibold bg-biscay-600/80 text-white'>
										Tagname
									</button>
									<button className='px-2 py-0.5 rounded-lg font-semibold bg-biscay-600/80 text-white'>
										Tagname
									</button>
									<button className='px-2 py-0.5 rounded-lg font-semibold bg-biscay-600/80 text-white'>
										Tagname
									</button>
									<button className='px-2 py-0.5 rounded-lg font-semibold bg-biscay-600/80 text-white'>
										Tagname
									</button>
									<button className='px-2 py-0.5 rounded-lg font-semibold bg-biscay-600/80 text-white'>
										Tagname
									</button>
									<button className='px-2 py-0.5 rounded-lg font-semibold bg-biscay-600/80 text-white'>
										Tagname
									</button>
								</div>
							</div>
						</div>
					</section>
					<section className='flex gap-5 px-5'>{/* Stats */}
						<div className='flex gap-2 items-center'>
							<div className='flex gap-1'>
								<StarIcon className='size-5 fill-yellow-400 stroke-yellow-400' />
								<StarIcon className='size-5 fill-yellow-400 stroke-yellow-400' />
								<StarIcon className='size-5 fill-yellow-400 stroke-yellow-400' />
								<StarIcon className='size-5 ' />
								<StarIcon className='size-5 ' />
							</div>
							<p className='font-light'>3.2</p>
						</div>
            <Button
              className='p-2'
              color='primary'
              variant='flat'
              shape='full'
              startContent={<DotsIcon className='size-5' />}
              onClick={handleMore}
            >
            </Button>
            {isMore&&(
              <>
                <Button
                  className='px-3 py-1'
                  color='primary'
                  variant='outline'
                  shape='full'
                  startContent={<ShareIcon className='size-5' />}
                >
                  Compartir
                </Button>
                <Button
                  className='px-3 py-1'
                  color='primary'
                  variant='outline'
                  shape='full'
                  startContent={<EditIcon className='size-5' />}
                >
                  Editar
                </Button>
                <Button
                  className='px-3 py-1'
                  color='destructive'
                  variant='outline'
                  shape='full'
                  startContent={<TrashIcon className='size-5' />}
                >
                  Eliminar
                </Button>
              </>
            )}
					</section>
					<section className='flex flex-col gap-2 p-2'> {/* Code */}
						<div className='flex w-full justify-between items-center'>
							<p className='text-lg font-semibold'>Nombre del archivo</p>
							<Button
								color='primary'
								variant='solid'
								className='px-5'
							>
								Descargar archivo
							</Button>
						</div>
						<div className='bg-storm-900 rounded-xl p-5 text-white'>
							<p>
								{`
                  import clsx from "clsx"
                  import React from "react"
                  import { twMerge } from "tailwind-merge"
                  import { Variants } from "./variants"

                  interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
                    variant?: "solid" | "outline" | "flat"
                    color?: "primary" | "secondary" | "destructive"
                    size?: "sm" | "md" | "lg"
                    marginX?: "none" | "auto"
                    shape?: "none" | "sm" | "md" | "lg" | "full"
                    isOnlyIcon?: boolean,
                    startContent?: React.ReactNode,
                    endContent?: React.ReactNode,
                  }

                  const baseClasses = "flex items-center gap-2 font-semibold px-4 py-2"
                `}
							</p>
						</div>
					</section>
				</div>
			</section>
      <section className="fixed right-5 top-5 bottom-5 w-full max-w-[300px] flex flex-col gap-3 bg-seagreen-900 text-white rounded-lg p-3 dark:ring-1 dark:ring-white dark:bg-transparent">
        <div className="flex flex-col items-center justify-between h-full gap-5">
          <div className="relative w-full text-center">
            <h4 className="text-xl font-semibold">Comentarios</h4>
            <span className="absolute top-1 right-3 text-sm font-light">10</span>
          </div>
          <div className="flex flex-col gap-3 py-5 border-t border-white/40 w-full h-full">

          </div>
          <InputWithIcon endContent={<MessagePlusIcon/>} onSubmit={()=>{}} type="text" placeholder="Deja tu comentario aqui"/>
        </div>
      </section>
		</>
	)
}

export default Post
