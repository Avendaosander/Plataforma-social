import { create } from 'zustand';
import { Follower } from '../lib/types/typesGraphql';

type FollowerState = {
  followings: Follower[]
  setFollowingList: (followingList: Follower[]) => void;
  setFollowing: (follower: Follower) => void;
  removeFollowing: (follower: Follower) => void;
  isFollowing: (idUser: string) => boolean
};

export const useFollowerStore = create<FollowerState>((set, get) => ({
  followings: [],
  setFollowingList: (list: Follower[]) => {
    set({ followings: list })
  },
  setFollowing: (follower: Follower) => set((state) => ({
    followings: [...state.followings, follower]
  })),
  removeFollowing: (follower: Follower) => set((state) => {
    const updatedFollowing = state.followings.filter(follow => follow != follower)
    return { followings: updatedFollowing };
  }),
  isFollowing: (idUser: string) => {
    const { followings } = get()
    return followings.some(follower => follower.idFollowing === idUser)
  }
}));
