import React, { useState } from 'react'
import XIcon from '../icons/XIcon'
import Button from '../ui/Button';
import InputRatingStar from '../ui/InputRatingStar';
import { DELETE_RATING, POST_RATING, PUT_RATING } from '@/app/lib/graphql/ratings';
import { useMutation, useQuery } from '@apollo/client';
import { DeleteRating, PostRating, PutRating, Rating, RatingInputDelete } from '@/app/lib/types/typesGraphql';
import { useUserStore } from '@/app/store/user';
import { toastCustom } from '../ui/toasts';
import { GET_POST } from '@/app/lib/graphql/posts';

type ModalProps = {
  isOpen: boolean;
  idPost: string
  myRating: number
  onClose: () => void;
};

function ModalRating({ isOpen, idPost, myRating, onClose }: ModalProps) {
	const [currentRating, setCurrentRating] = useState(myRating)
	const idUser = useUserStore(state => state.user.id)
  const isRated = myRating != undefined

	const [postRating] = useMutation<PostRating, Rating>(POST_RATING)
	const [putRating] = useMutation<PutRating, Rating>(PUT_RATING)
	const [deleteRating] = useMutation<DeleteRating, RatingInputDelete>(DELETE_RATING)
  const {refetch} = useQuery(GET_POST,{
    variables: {
      getPostId: idPost
		},
  })
  
  if (!isOpen) return null
  
  const onRatingChange = (rating: number) => {
    setCurrentRating(rating)
  }

	const submitRating = async () => {
    if (isRated) {
      if (myRating === currentRating) return toastCustom({text: 'No puedes modificar a la misma calificacion', variant: 'error', duration: 2000})
      const res = await putRating({
        variables: {
          idPost,
          idUser,
          rating: currentRating
        }
      })
  
      if (res.data?.putRating) {
        refetch()
        onClose()
      }
    } else {
      const res = await postRating({
        variables: {
          idPost,
          idUser,
          rating: currentRating
        }
      })
  
      if (res.data?.postRating) {
        refetch()
        onClose()
      }
    }
	}

  const onDelete = async () => {
    const res = await deleteRating({
      variables: {
        idPost,
        idUser
      }
    })

    if (res.data?.deleteRating) {
      refetch()
      onClose()
    }
  }

  return (
    <div className='absolute top-0 bottom-0 left-0 right-0 bg-black/50 flex justify-center items-center'>
		  <section className='flex flex-col bg-storm-50 dark:bg-storm-950 rounded-xl'>
        <header className='flex justify-between items-center p-5 gap-5 border-b border-seagreen-950/40 dark:border-white/20'>
          <h3 className='text-2xl font-semibold'>Califica este componente</h3>
          <button onClick={() => onClose()}>
            <XIcon />
          </button>
        </header>
        <div className='flex justify-center py-2'>
          <InputRatingStar onRatingChange={onRatingChange} rating={myRating}/>
        </div>
        <footer className='flex justify-center gap-5 p-5 border-t border-seagreen-950/40 dark:border-white/20'>
          <Button
            color='destructive'
            variant='solid'
            className='px-5'
            onClick={() => onClose()}
          >
            Cancelar
          </Button>
          {isRated && (
            <Button
              color='destructive'
              variant='flat'
              className='px-5'
              onClick={() => onDelete()}
            >
              Eliminar
            </Button>
          )}
          <Button
            color='primary'
            variant='solid'
            className='px-5'
            onClick={() => {
              submitRating()
            }}
          >
            {isRated ? 'Modificar' : 'Confirmar'}
          </Button>
        </footer>
      </section>
    </div>
  )
}

export default ModalRating