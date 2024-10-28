"use client"

import {
	DotsIcon,
	EditIcon,
	ShareIcon,
	TrashIcon
} from "@/icons/icons"
import Button from "@/ui/Button"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import { useMutation, useQuery } from "@apollo/client"
import { DELETE_POST, GET_POST } from "@/app/lib/graphql/posts"
import {
	CommentInput,
	CommentsWithData,
	DataPost,
	File,
	PostComment,
	ResponseID
} from "@/app/lib/types/typesGraphql"
import { getTimeElapsed } from "@/app/lib/logic"
import { useModalStore } from "@/app/store/modalDelete"
import { useUserStore } from "@/app/store/user"
import { toastCustom } from "@/app/components/ui/toasts"
import { useRouter } from "next/navigation"
import Comments from "@/app/components/post/Comments"
import { DELETE_COMMENT, POST_COMMENT } from "@/app/lib/graphql/comments"
import RatingStars from "@/app/components/ui/RatingStars"
import ModalRating from "@/app/components/post/ModalRating"
import ModalEditPost from "@/app/components/post/ModalEditPost"
import ShareModal from "@/app/components/ui/ShareModal"

function Post({ params }: { params: { idPost: string } }) {
	const router = useRouter()
	const idUser = useUserStore(state => state.user.id)
	const { openModal } = useModalStore(state => state)
	const [isMore, setIsMore] = useState(false)
	const [isOpenRating, setIsOpenRating] = useState(false)
	const [isOpenEdit, setIsOpenEdit] = useState(false)
	const [comments, setComments] = useState<CommentsWithData[]>([])
	const [fileContents, setFileContents] = useState<{ [key: string]: string }>({})
	const [isShareModalOpen, setIsShareModalOpen] = useState(false)
	const shareUrl = `${process.env.NEXT_PUBLIC_URL}home/post/${params.idPost}`

	const { data, loading, error } = useQuery<DataPost>(GET_POST, {
		variables: {
			getPostId: params.idPost
		},
		fetchPolicy: "cache-and-network"
	})
	const [postDelete, { data: postDeleted }] = useMutation<DataPost>(DELETE_POST)

	const [postComment, { data: postCommented, loading: commentLoaded }] =
		useMutation<PostComment, CommentInput>(POST_COMMENT)
	const [deleteComment, { data: commentDeleted, loading: loadingDeleted }] =
		useMutation<ResponseID>(DELETE_COMMENT)

	const preview = data?.getPost
		? `${process.env.NEXT_PUBLIC_API_ROUTE_PREVIEW}${data.getPost.preview}`
		: "/Logo/main-logo.png"
	const isMyPost = data?.getPost.user.id === idUser
	const handleMore = () => {
		setIsMore(!isMore)
	}

	const handleDelete = () => {
		openModal("Esta seguro de eliminar este componente?", () => {
			postDelete({
				variables: {
					deletePostId: params.idPost
				}
			})
		})
	}

	const submitComment = async (text: string) => {
		if (text === '') {
      return toastCustom({text: 'No puedes hacer un comentario vacio', variant: 'error', duration: 2000})
    }
		const res = await postComment({
			variables: {
				idUser,
				idPost: params.idPost,
				text
			}
		})

		if (res.data) {
			setComments([res.data.postComment, ...comments])
		}
	}

	const deletedComment = async (id: string) => {
		const res = await deleteComment({
			variables: {
				deleteCommentId: id
			}
		})

		if (res.data) {
			setComments(comments.filter(comment => comment.id !== id))
		}
	}

	if (postDeleted) {
		toastCustom({
			text: "Componente eliminado",
			variant: "success",
			duration: 2000
		})
		router.back()
	}

	useEffect(() => {
		if (data?.getPost) {
			setComments(data.getPost.Comment)
			fetchFiles(data.getPost.File)
		}
	}, [data])

	const fetchFiles = async (files: File[]) => {
		const contents: { [key: string]: string } = {}
		for (const file of files) {
			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_ROUTE_FILE}${file.file}`
				)
				const text = await response.text()
				contents[file.file] = text
			} catch (error) {
				console.error(`Error fetching file ${file.file}:`, error)
			}
		}
		setFileContents(contents)
	}

	return (
		loading ? (
			<p>Cargando...</p>
		):(
			data?.getPost ? (
				<>
					<section className='flex flex-col gap-3 items-center max-w-3xl w-full mr-56'>
						<h2 className='text-3xl font-semibold'>{data.getPost.title}</h2>
						<div className='flex flex-col gap-4 w-full'>
							{/* Container */}
							<p className='max-w-[80ch]'>{data.getPost.description}</p>
							<section className='flex gap-5 w-full'> {/* Info */}
								<Image
									src={preview}
									alt='Preview'
									width={120}
									height={120}
									className='size-[120px]'
								/>
								<div className='flex flex-col gap-2'>
									{/*  */}
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
												<button
													key={tech.idTechnology}
													className='px-2 py-0.5 rounded-lg font-semibold bg-biscay-600/80 text-white'
												>
													{tech.tech.name}
												</button>
											))}
										</div>
									</div>
									<div className='flex gap-2'>
										<p className='font-semibold'>Calificacion:</p>
										<div className='flex flex-col'>
											<RatingStars rating={data.getPost.rating} />
											<p className='text-sm font-light opacity-50'>
												{data.getPost._count.Rating} calificaciones
											</p>
										</div>
									</div>
								</div>
							</section>
							<section className='flex gap-5'> {/* Stats */}
								<Button
									className='px-3 py-1'
									color='primary'
									variant='flat'
									shape='full'
									onClick={() => setIsOpenRating(true)}
								>
									Calificar
								</Button>
								<div className='flex gap-5'>
									<Button
										className='p-2'
										color='primary'
										variant='flat'
										shape='full'
										startContent={<DotsIcon className='size-5' />}
										onClick={handleMore}
									></Button>
									{isMore && (
										<>
											<Button
												className='px-3 py-1'
												color='primary'
												variant='outline'
												shape='full'
												startContent={<ShareIcon className='size-5' />}
												onClick={() => setIsShareModalOpen(true)}
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
														onClick={() => setIsOpenEdit(true)}
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
								</div>
							</section>
							{data.getPost.File.map(file => (
								<section
									key={file.id}
									className='flex flex-col gap-2 py-2'
								> {/* Code */}
									<div className='flex w-full justify-between items-center'>
										<p className='text-lg font-semibold'>{file.file}</p>
										<a
											href={`${process.env.NEXT_PUBLIC_API_ROUTE_FILE}${file.file}`}
											download={file.file}
										>
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
										<pre className='max-h-60 overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-storm-50/20 hover:scrollbar-thumb-white/50 active:scrollbar-thumb-white scrollbar-thumb-rounded-full'>
											{fileContents[file.file]}
										</pre>
									</div>
								</section>
							))}
						</div>
					</section>
					<Comments
						comments={comments}
						submitComment={submitComment}
						deleteComment={deletedComment}
						isAutor={idUser === data.getPost.user.id}
					/>
					<ModalRating 
						isOpen={isOpenRating}
						onClose={() => setIsOpenRating(false)}
						idPost={data.getPost.id}
						myRating={data.getPost.myRating?.rating}
					/>
	
					{isOpenEdit && (
						<ModalEditPost
							post={data.getPost}
							onClose={() => setIsOpenEdit(false)}
							onConfirm={() => {}}
						/>
					)}
					{isShareModalOpen && (
						<ShareModal
							onClose={() => setIsShareModalOpen(false)}
							shareUrl={shareUrl}
						/>
					)}
				</>
			) : (
				<div className="flex flex-col items-center gap-10 min-h-screen m-auto">
					<h2 className="text-3xl font-bold">Este componente no fue encontrado</h2>
					<p className="text-xl">Es posible que haya sido eliminado, intenta ponerte en contacto con el autor.</p>
				</div>
			)
		)
	)
}

export default Post
