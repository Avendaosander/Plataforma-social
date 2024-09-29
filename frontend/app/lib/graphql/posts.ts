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
      rating
      isSaved
      createdAt
    }
  }
`

export const GET_POSTS = gql`
  query GetPosts($cursor: String, $take: Int) {
    getPosts(cursor: $cursor, take: $take) {
      posts {
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
        isFollowing
        isSaved
        rating
        createdAt  
      },
      cursor
    }
  }
`

export const GET_POSTS_FOLLOWINGS = gql`
  query GetPostsFollowings {
    getPostsFollowings {
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
      rating
      isFollowing
      isSaved
      createdAt
    }
  }
`

export const GET_POSTS_FILTER = gql`
  query GetPostsFilter($filter: PostFilterInput!) {
    getPostsFilter(filter: $filter) {
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
      rating
      isFollowing
      isSaved
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
      rating
      isSaved
      myRating {
        rating
        idPost
        idUser
      }
      _count {
        Rating
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
  mutation PutPost($putPostId: String!, $title: String, $description: String, $technologies: [TechnologyInput]!, $newTechnologies: [NewTechnology], $filesDelete: [FilesDelete]) {
    putPost(id: $putPostId, title: $title, description: $description, technologies: $technologies, newTechnologies: $newTechnologies, filesDelete: $filesDelete) {
      id
      title
      description
      preview
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