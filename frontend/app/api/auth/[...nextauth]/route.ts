import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';
import { LOGIN } from "@/app/lib/graphql/users";
import { print } from "graphql";
import { NextAuthOptions } from "next-auth";
import { formatGraphQLErrors } from "@/app/lib/logic";
import { ResponseLogin } from "@/app/lib/types/typesGraphql";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {label: 'Username', type: 'text', placeholder: 'Username'},
        password: {label: 'Password', type: 'password', placeholder: 'Password'},
      },
      async authorize(credentials, req) {
        if (!credentials) {
          throw new Error('Credenciales incompletas');
        }

        try {
          const body = JSON.stringify({
            query: print(LOGIN),
            variables: {
              email: credentials.email,
              password: credentials.password
            },
          });

          const response = await fetch(`${process.env.API_ROUTE_GRAPHQL}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body,
          });

          const { data, errors }: ResponseLogin = await response.json();
          
          if (errors) {
            const formattedErrors = formatGraphQLErrors(errors);
            throw new Error (`${formattedErrors}`);
          }

          const userFound = data.login;
          
          const matchPassword = await bcrypt.compare(credentials.password, userFound.password)
          
          if (!matchPassword) throw new Error ('Contraseña incorrecta')
        
          // console.log(userFound)
          return userFound
        } catch (error:any) {
          throw new Error (error.message);
        }
      },
    })
  ],
  callbacks: {
    async jwt({ token, user, session, trigger }) {
      // console.log("jwt callback: ", { token, user, session})

      if (trigger === "update" && session?.description) {
        token.description = session.description
      }

      if (trigger === "update" && session?.avatar) {
        token.avatar = session.avatar
      }
      
      if (user) {
        return {
          ...token,
          id: user.id,
          username: user.username,
          avatar: user.avatar,
          description: user.description,
          token: user.token
        }
      }
      return token
    },
    async session({session, token, user}) {
      // console.log("session callback: ", { session, token, user})
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          username: token.username,
          avatar: token.avatar,
          description: token.description,
        },
        token: token.token
      }
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST};