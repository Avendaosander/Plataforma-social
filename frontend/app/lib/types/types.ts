export type pathsUploads = 'avatar' | 'preview' | 'files' 

export interface FilterSearch {
  filter: FilterType
}

export type FilterType = [FilterPrimary, FilterSecondary]
export type FilterPrimary = 'title' | 'technology' | 'user'
export type FilterSecondary = 'rating'