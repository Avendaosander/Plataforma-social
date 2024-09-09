"use client"

import InputWithIcon from "@/ui/InputWithIcon"
import { DotsIcon, EditIcon, MessagePlusIcon, ShareIcon, StarIcon, TrashIcon } from "@/icons/icons"
import Button from "@/ui/Button"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import { useMutation, useQuery } from "@apollo/client"
import { DELETE_POST, GET_POST, GET_POSTS, GET_POSTS_USER } from "@/app/lib/graphql/posts"
import { DataPost, File } from "@/app/lib/types/typesGraphql"
import { getTimeElapsed } from "@/app/lib/logic"
import { useModalStore } from "@/app/store/modalDelete"
import { useUserStore } from "@/app/store/user"
import { toastCustom } from "@/app/components/ui/toasts"
import { useRouter } from "next/navigation"
import Comments from "@/app/components/post/Comments"

function Post({ params }: { params: { idPost: string } }) {
	const router = useRouter()
	const [isMore, setIsMore] = useState(false)
  const idUser = useUserStore(state => state.user.id)
  const { openModal } = useModalStore(state => state)
  const [fileContents, setFileContents] = useState<{ [key: string]: string }>({});
	const [postDelete, { data: postDeleted }] = useMutation(DELETE_POST,{
		refetchQueries: [
			{
				query: GET_POSTS
			},
			{
				query: GET_POSTS_USER,
				variables: { idUser }
			}
		]
	})
	const { data, loading, error } = useQuery<DataPost>(GET_POST, {
		variables: {
			getPostId: params.idPost
		}
	})
	const preview = data?.getPost ? `${process.env.NEXT_PUBLIC_API_ROUTE_PREVIEW}${data.getPost.preview}` : "/Logo/main-logo.png"
	const isMyPost = data?.getPost.user.id === idUser
	const handleMore = () => {
		setIsMore(!isMore)
	}

	const handleDelete = () => {
    openModal(
      'Esta seguro de eliminar este componente?',
      () => {
				postDelete({
					variables: {
						deletePostId: params.idPost
					}
				})
      }
    )
  }

	if (postDeleted) {
		toastCustom({ text: 'Componente eliminado', variant: "success", duration: 2000})
		router.back()
	}

	useEffect(() => {
    if (data?.getPost) {
      fetchFiles(data.getPost.File);
    }
  }, [data]);

	const fetchFiles = async (files: File[]) => {
    const contents: { [key: string]: string } = {};
    for (const file of files) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROUTE_FILE}${file.file}`);
        const text = await response.text();
        contents[file.file] = text;
      } catch (error) {
        console.error(`Error fetching file ${file.file}:`, error);
      }
    }
    setFileContents(contents);
  };
console.log(data?.getPost)

	return (
		data?.getPost && (
			<>
				<section className='flex flex-col gap-3 items-center max-w-3xl w-full mr-56'>
					<h2 className='text-3xl font-semibold'>{data.getPost.title}</h2>
					<div className='flex flex-col gap-3 w-full'>{/* Container */}
						<p className='px-5 max-w-[80ch]'>
							{data.getPost.description}
						</p>
						<section className='flex gap-5 w-full'>{/* Info */}
							<Image
								src={preview}
								alt='Preview'
								width={120}
								height={120}
								className='size-[120px]'
							/>
							<div className='flex flex-col gap-2'>{/*  */}
								<div className='flex gap-2'>
									<p className='font-semibold'>Desarrollado por:</p>
									<p>{data.getPost.user.username}</p>
								</div>
								<div className='flex gap-2'>
									<p className='font-semibold'>Fecha de publicacion:</p>
									<p>{getTimeElapsed(data.getPost.createdAt)}</p>
								</div>
								<div className='flex gap-2'>
									<p className='font-semibold'>Stack:</p>
									<div className='flex flex-wrap gap-2'>
										{data.getPost.Stack.map(tech => (
											<button key={tech.idTechnology} className='px-2 py-0.5 rounded-lg font-semibold bg-biscay-600/80 text-white'>
												{tech.tech.name}
											</button>
										))}
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
									{isMyPost && (
										<>
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
												onClick={() => handleDelete()}
											>
												Eliminar
											</Button>
										</>
									)}
								</>
							)}
						</section>
						{data.getPost.File.map(file => (
							<section key={file.id} className='flex flex-col gap-2 p-2'> {/* Code */}
								<div className='flex w-full justify-between items-center'>
									<p className='text-lg font-semibold'>{file.file}</p>
									<a href={`${process.env.NEXT_PUBLIC_API_ROUTE_FILE}${file.file}`} download={file.file}>
										<Button
											color='primary'
											variant='solid'
											className='px-5'
											
										>
											Descargar archivo
										</Button>
									</a>
								</div>
								<div className='bg-storm-900 rounded-xl p-5 text-white'>
									<pre className="max-h-60 overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-storm-50/20 hover:scrollbar-thumb-white/50 active:scrollbar-thumb-white scrollbar-thumb-rounded-full">{fileContents[file.file]}</pre>
								</div>
							</section>
						))}
					</div>
				</section>
				<Comments comments={data.getPost.Comment}/>
			</>
		)
	)
}

export default Post
