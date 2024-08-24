import { Prisma, PrismaClient } from "@prisma/client"
import { GraphQLError } from "graphql"
import { Context, Notification } from "../../types"

const prisma = new PrismaClient()

export const getNotifications = async (_: any, { idUser }: { idUser: string }, context: Context) => {
  try {
    if (!context.auth) {
      throw new GraphQLError("Not authenticated", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 }
        }
      })
    }

    const notifications = await prisma.notification.findMany({
      where: { idUser },
      orderBy: {
        createdAt: "asc"
      },
    })
  
    return notifications
    
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

export const postNotification = async ({idUser, message}: Notification) => {
  try {
    const notification = await prisma.notification.create({
      data: { 
        idUser,
        message
      }
    })
  
    return notification
    
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

export const putNotification = async (_: any, { id, read }: { id: string, read: boolean }, context: Context) => {
  try {
    if (!context.auth) {
      throw new GraphQLError("Not authenticated", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 }
        }
      })
    }

    const isExist = await prisma.notification.findUnique({
      where: { id },
    })

    if (!isExist) {
      throw new GraphQLError('Not found', {
        extensions: {
          code: 'NOT_FOUND',
          http: { status: 404 }
        }
      })
    }

    const notification = await prisma.notification.update({
      where: { id },
      data: { read }
    })
  
    return notification
    
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

export const deleteNotification = async (_: any, { id }: { id: string }, context: Context) => {
  try {
    if (!context.auth) {
      throw new GraphQLError("Not authenticated", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 }
        }
      })
    }

    const isExist = await prisma.notification.findUnique({
      where: { id },
    })

    if (!isExist) {
      throw new GraphQLError('Not found', {
        extensions: {
          code: 'NOT_FOUND',
          http: { status: 404 }
        }
      })
    }

    const notification = await prisma.notification.delete({
      where: { id },
    })
  
    return notification
    
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