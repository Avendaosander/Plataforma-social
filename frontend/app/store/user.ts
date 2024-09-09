import { create } from "zustand";
import { type Setting, type GetUser, LoginClass, PutUser, Follower } from "@/typesGraphql";

interface State {
  user: GetUser,
  Setting: Setting
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
    Setting: {
      idSettings: '',
      private: false,
      n_ratings: false,
      n_comments: false,
      n_followers: false,
      n_populates: false,
      n_email_comments: false,
      n_email_followers: false,
      n_email_ratings: false,
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
        Setting: user.Setting,
      })
    },
    updateInfoUser: (user) => {
      set({ user: user })
    }
  }
})