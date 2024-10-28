import { gql } from "@apollo/client";

export const SEND_EMAIL_CODE = gql`
  mutation SendRecoveryCode($email: String!) {
    sendRecoveryCode(email: $email) {
      response
    }
  }
` 

export const VERIFY_CODE = gql`
  mutation VerifyCode($email: String!, $code: String!) {
    verifyCode(email: $email, code: $code) {
      response
    }
  }
` 

export const RESET_PASSWORD = gql`
  mutation ChangePassword($email: String!, $password: String!) {
    changePassword(email: $email, password: $password) {
      response
    }
  }
` 