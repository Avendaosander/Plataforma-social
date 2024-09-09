import { gql } from "@apollo/client";

export const GET_TECHNOLOGIES = gql`
  query GetTechnologies {
    getTechnologies {
      id
      name
    }
}
`