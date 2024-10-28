import { Prisma, PrismaClient } from "@prisma/client"
import { GraphQLError } from "graphql"
import { Context } from "../../types"
import { pushNotification } from "../../lib/functions.js"
import { MESSAGE } from "../../lib/constant.js"

const prisma = new PrismaClient()

export const getComments = async (_: any, { id }: { id: string }, context: Context) => {
  try {
    if (!context.auth) {
      throw new GraphQLError("Not authenticated", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 }
        }
      })
    }

    const comments = await prisma.comment.findMany({
      where: {
        idPost: id
      },
      orderBy: {
        createdAt: "desc"
      },
      include: {
        user: {
          select: {
            avatar: true,
            username: true
          }
        }
      }
    })
  
    return comments
    
  } catch (error) {
    if (error instanceof GraphQLError) {
      // Re-lanzar errores conocidos de GraphQL
      throw error;
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Manejar errores específicos de Prisma
      throw new GraphQLError("Error en la base de datos", {
        extensions: {
          code: "DATABASE_ERROR",
          http: { status: 500 }
        }
      });
    } else {
      // Manejar errores inesperados
      throw new GraphQLError("Internal server error", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          http: { status: 500 }
        }
      });
    }
  }
}

export const postComment = async (_: any, { idPost, idUser, text }: { idPost: string, idUser: string, text: string }, context: Context) => {
  try {
    if (!context.auth) {
      throw new GraphQLError("Not authenticated", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 }
        }
      })
    }

    const findPost = await prisma.post.findUnique({
      where: {id: idPost},
      include: {
        user: {
          select: {
            email: true,
            subscriptionWP: true,
            Setting: {
              select: {
                n_comments: true,
                n_email_comments: true
              }
            }
          },
        }
      }
    })

    const newComment = await prisma.comment.create({
      data: {
        idUser,
        idPost,
        text
      },
      include: {
        user: {
          select: {
            id: true,
            avatar: true,
            username: true
          }
        }
      }
    })
    
    const link = `home/post/${idPost}`

    const notification = await pushNotification({
      idUser: findPost.idUser,
      idUserSend: idUser,
      username: newComment.user.username,
      email: findPost.user.email,
      title: 'Nuevo comentario',
      message: MESSAGE.NEW_COMMENT,
      subscription: findPost.user.subscriptionWP,
      link,
      sendPush: findPost.user.Setting.n_comments,
      sendEmail: findPost.user.Setting.n_email_comments,
    })
  
    return newComment
    
  } catch (error) {
    if (error instanceof GraphQLError) {
      // Re-lanzar errores conocidos de GraphQL
      throw error;
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Manejar errores específicos de Prisma
      throw new GraphQLError("Error en la base de datos", {
        extensions: {
          code: "DATABASE_ERROR",
          http: { status: 500 }
        }
      });
    } else {
      // Manejar errores inesperados
      throw new GraphQLError("Internal server error", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          http: { status: 500 }
        }
      });
    }
  }
}

export const deleteComment = async (_: any, { id }: { id: string }, context: Context) => {
  try {
    if (!context.auth) {
      throw new GraphQLError("Not authenticated", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 }
        }
      })
    }

    const isExist = await prisma.comment.findUnique({
      where: { id }
    })
  
    if (!isExist) {
      throw new GraphQLError('Not found', {
        extensions: {
          code: 'NOT_FOUND',
          http: { status: 404 }
        }
      })
    }
  
    return await prisma.comment.delete({
      where: { id }
    })
    
  } catch (error) {
    if (error instanceof GraphQLError) {
      // Re-lanzar errores conocidos de GraphQL
      throw error;
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Manejar errores específicos de Prisma
      throw new GraphQLError("Error en la base de datos", {
        extensions: {
          code: "DATABASE_ERROR",
          http: { status: 500 }
        }
      });
    } else {
      // Manejar errores inesperados
      throw new GraphQLError("Internal server error", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          http: { status: 500 }
        }
      });
    }
  }
}