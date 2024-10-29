'use client'
import Navbar from "@/ui/Navbar";
import SessionProvider from "@/lib/SessionProvider";
import { Toaster } from "react-hot-toast";
import ModalDelete from "@/ui/ModalDelete";
import { useModalStore } from "@/store/modalDelete";


export default function Layout ({ children } : { children: React.ReactNode }) {
  const { title, isOpen, closeModal, onConfirm } = useModalStore(state => state)

  return (
    <SessionProvider>
      <div className="flex">
        <aside className="lg:min-w-52">
          <Navbar/>
        </aside>
        <main className="w-full flex flex-col items-center min-h-screen p-5 lg:pr-10 pb-10 lg:py-5 gap-5">
          {children}
        </main>
        <Toaster/>
        <ModalDelete
          isOpen={isOpen}
          onClose={closeModal}
          onConfirm={onConfirm}
          title={title}
        />
      </div>
    </SessionProvider>
  )
}