import { gql } from "@apollo/client";

export const GET_POSTS_USER = gql`
  query GetPostsUser($idUser: String!) {
    getPostsUser(idUser: $idUser) {
      id
      user {
        id
        username
        avatar
      }
      title
      description
      preview
      Stack {
        idPost
        idTechnology
        tech {
          id
          name
        }
      }
      comments
      saved
      createdAt
    }
  }
`

export const GET_POSTS = gql`
  query GetPosts {
    getPosts {
      id
      user {
        id
        username
        avatar
      }
      title
      description
      preview
      Stack {
        idPost
        idTechnology
        tech {
          id
          name
        }
      }
      comments
      saved
      createdAt
    }
  }
`

export const GET_POST = gql`
  query GetPost($getPostId: String!) {
    getPost(id: $getPostId) {
      id
      user {
        id
        username
        avatar
      }
      title
      description
      preview
      Comment {
        id
        idPost
        idUser
        text
        createdAt
        user {
          id
          username
          avatar
        }
      }
      Stack {
        idPost
        idTechnology
        tech {
          id
          name
        }
      }
      saved
      createdAt
      _count {
        Post_saved
      }
      File{
        id
        idPost
        file
      }
    }
  }
`

export const POST_POST = gql`
  mutation PostPost($title: String!, $description: String!, $technologies: [TechnologyInput]!, $newTechnologies: [NewTechnology]) {
  postPost(title: $title, description: $description, technologies: $technologies, newTechnologies: $newTechnologies) {
    id
    title
    description
    preview
    Stack {
      idPost
      idTechnology
    }
    saved
    createdAt
  }
}
`

export const PUT_POST = gql`
  mutation PutPost($idUser: String!, $title: String, $description: String, $preview: String) {
    putPost(idUser: $idUser, title: $title, description: $description, preview: $preview) {
      id
      user {
        id
        username
        avatar
      }
      title
      description
      preview
      Comment {
        id
        idPost
        idUser
        text
        createdAt
      }
      Stack {
        idPost
        idTechnology
        tech {
          id
          name
        }
      }
      saved
      _count {
        Post_saved
      }
      createdAt
    }
  }
`

export const DELETE_POST = gql`
  mutation DeletePost($deletePostId: String!) {
    deletePost(id: $deletePostId) {
      id
    }
  }
`