import { create } from "zustand";
import { type GetUser, LoginClass, PutUser } from "@/typesGraphql";

interface State {
  user: GetUser,
  updateState: (user: LoginClass) => void
  updateInfoUser: (user: PutUser) => void
}

export const useUserStore = create<State>((set) => {
  return {
    user: {
      id: '',
      username: '',
      email: '',
      avatar: '',
      description: ''
    },
    updateState: (user) => {
      set({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          description: user.description,
        },
      })
    },
    updateInfoUser: (user) => {
      set({ user: user })
    }
  }
})