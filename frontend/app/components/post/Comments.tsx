import React, { useState } from 'react'
import InputWithIcon from '../ui/InputWithIcon'
import MessagePlusIcon from '../icons/MessagePlusIcon'
import { CommentsWithData } from '@/app/lib/types/typesGraphql'
import Comment from './Comment'

interface CommentsProps {
  comments: CommentsWithData[]
  submitComment: (text: string) => void
  deleteComment: (id: string) => void
}

function Comments({ comments, submitComment, deleteComment }: CommentsProps) {
  const [text, setText] = useState('')

  const handleChange = (text: string) => {
    setText(text)
  }
  return (
    <section className="fixed right-5 top-5 bottom-5 w-full max-h-screen max-w-[300px] flex flex-col gap-3 bg-seagreen-900 text-white rounded-lg p-3 dark:ring-1 dark:ring-white dark:bg-transparent">
      <div className="flex flex-col items-center justify-between h-full gap-5">
        <div className="relative w-full text-center">
          <h4 className="text-xl font-semibold">Comentarios</h4>
          <span className="absolute top-1 right-3 text-sm font-light">{comments.length}</span>
        </div>
        <div className="flex flex-col gap-3 py-5 border-t border-white/40 w-full h-full overflow-y-auto scrollbar-thin">
          {comments.map(comment => (
            <Comment key={comment.id} comment={comment}/>
          ))}
        </div>
        <InputWithIcon text={text} setText={setText} handleChange={handleChange} endContent={<MessagePlusIcon/>} onSubmit={submitComment} type="text" placeholder="Deja tu comentario aqui"/>
      </div>
    </section>
  )
}

export default Comments