export type pathsUploads = 'avatar' | 'preview' | 'files' 

export interface FilterSearch {
  filter: FilterType
}

export type FilterType = [FilterPrimary, FilterSecondary]
export type FilterPrimary = 'title' | 'technology' | 'user'
export type FilterSecondary = 'rating'

export type NameSettings = 'n_ratings' |'n_comments' |'n_followers' |'n_populates' |'n_new_post' |'n_edit_post' |'n_delete_post' |'n_email_comments' |'n_email_followers' |'n_email_ratings' |'n_email_new_post' |'n_email_edit_post' |'n_email_delete_post'