import { gql } from "@apollo/client";

export const GET_NOTIFICATIONS = gql`
  query GetNotifications($idUser: String!, $cursor: String, $take: Int) {
    getNotifications(idUser: $idUser, cursor: $cursor, take: $take) {
      notifications {
        id
        idUser
        user {
          username
          avatar
        }
        idUserSend
        userSend {
          username
          avatar
        }
        message
        link
        read
        createdAt
      }
      unread
      cursor
      hasMore
    }
  }
`

export const PUT_NOTIFICATION = gql`
  mutation PutNotification($putNotificationId: String!, $read: Boolean!) {
    putNotification(id: $putNotificationId, read: $read) {
      id
    }
  }
`

export const DELETE_NOTIFICATION = gql`
  mutation DeleteNotification($deleteNotificationId: String!) {
    deleteNotification(id: $deleteNotificationId) {
      id
    }
  }
`