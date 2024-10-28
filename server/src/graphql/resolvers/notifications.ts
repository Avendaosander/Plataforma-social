import { Prisma, PrismaClient } from "@prisma/client"
import { GraphQLError } from "graphql"
import { Context } from "../../types"

const prisma = new PrismaClient()

export const getNotifications = async (_: any, { idUser, cursor, take }: { idUser: string, cursor?: string, take?: number }, context: Context) => {
  try {
    if (!context.auth) {
      throw new GraphQLError("Not authenticated", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 }
        }
      })
    }

		const limit = take || 10;

    const notifications = await prisma.notification.findMany({
      where: { 
        idUser,
				...(cursor && {
					createdAt: {
						lt: new Date(parseInt(cursor)),
					},
				}), 
      },
      include: {
        user: {
          select: {
            avatar: true,
            username: true
          }
        },
        userSend: {
          select: {
            avatar: true,
            username: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
			take: limit + 1
    })
    
		const hasMore = notifications.length > limit;
    
		const limitedNotifications = hasMore ? notifications.slice(0, limit) : notifications
    const unread = await prisma.notification.count({
      where: {
        idUser,
        read: false
      }
    })
    
    const notificationsFormated = {
      notifications: limitedNotifications,
      unread,
			cursor: limitedNotifications.length > 0 ? limitedNotifications[limitedNotifications.length - 1].createdAt.getTime().toString() : null,
			hasMore
    }
    return notificationsFormated
    
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