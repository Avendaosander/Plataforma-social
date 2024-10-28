import { gql } from "@apollo/client";

export const GET_SETTING = gql`
  query GetSettings($idUser: String!) {
    getSettings(idUser: $idUser) {
      idSetting
      idUser
      private
      n_ratings
      n_comments
      n_followers
      n_populates
      n_new_post
      n_edit_post
      n_delete_post
      n_email_ratings
      n_email_comments
      n_email_followers
      n_email_new_post
      n_email_edit_post
      n_email_delete_post
    }
  }
`
export const PUT_SETTING = gql`
  mutation PutSettings($data: SettingInput) {
    putSettings(data: $data) {
      idSetting
      idUser
      private
      n_ratings
      n_comments
      n_followers
      n_populates
      n_new_post
      n_edit_post
      n_delete_post
      n_email_ratings
      n_email_comments
      n_email_followers
      n_email_new_post
      n_email_edit_post
      n_email_delete_post
    }
  }
`