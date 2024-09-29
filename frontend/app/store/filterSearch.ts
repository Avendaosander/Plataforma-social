import { create } from "zustand";
import { FilterSearch, FilterType } from "../lib/types/types";

interface State {
  filterSearh: FilterSearch;
  setFilterSearh: (filters: FilterType) => void;
}

export const useFilterSearchStore = create<State>((set) => {
  return {
    filterSearh: { filter: ['title', 'rating'] },
    setFilterSearh: (filters: FilterType) => {  
      set({ filterSearh: { filter: filters } });
    },
  }
})
