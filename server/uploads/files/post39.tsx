import React from 'react'
import XIcon from '../icons/XIcon';
import Button from './Button';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
};

function ModalDelete({ title, isOpen, onClose, onConfirm}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className='absolute top-0 bottom-0 left-0 right-0 bg-black/50 flex justify-center items-center'>
		  <section className='flex flex-col bg-storm-50 dark:bg-storm-950 rounded-xl'>
        <header className='flex justify-between items-center p-5 gap-5 border-b border-seagreen-950/40 dark:border-white/20'>
          <h3 className='text-2xl font-semibold'>{title}</h3>
          <button onClick={() => onClose()}>
            <XIcon />
          </button>
        </header>
			<footer className='flex justify-center gap-5 p-5 border-t border-seagreen-950/40 dark:border-white/20'>
				<Button
					color='destructive'
					variant='solid'
					className='px-5'
					onClick={() => onClose()}
				>
					Cancelar
				</Button>
				<Button
					color='primary'
					variant='solid'
					className='px-5'
					onClick={() => {
						onConfirm()
						onClose()
					}}
				>
					Confirmar
				</Button>
			</footer>
      </section>
    </div>
  )
}

export default ModalDelete