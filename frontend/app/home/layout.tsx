import Navbar from "@/ui/Navbar";
import SessionProvider from "../lib/SessionProvider";
import { Toaster } from "react-hot-toast";


export default function Layout ({ children } : { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex">
        <aside className="w-52">
          <Navbar/>
        </aside>
        <main className="w-full flex flex-col justify-center items-center min-h-screen pr-10 py-5 gap-5">
          {children}
        </main>
        <Toaster/>
      </div>
    </SessionProvider>
  )
}