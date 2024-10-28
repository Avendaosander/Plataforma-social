import { Prisma, PrismaClient } from "@prisma/client"
import { GraphQLError } from "graphql"
import { Context } from "../../types.js"
import { pushNotification } from "../../lib/functions.js"
import { MESSAGE } from "../../lib/constant.js"

const prisma = new PrismaClient()

export const getFollowers = async (_: any, { idFollower }: { idFollower: string }, context: Context) => {
  try {
    if (!context.auth) {
      throw new GraphQLError("Not authenticated", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 }
        }
      })
    }

    const followers = await prisma.follower.findMany({
      where: { idFollower }
    });

    return followers
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

export const postFollower = async (_: any, {idFollower, idFollowing}: {idFollower: string, idFollowing: string}, context: Context) => {
  try {
    if (!context.auth) {
      throw new GraphQLError("Not authenticated", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 }
        }
      })
    }

    console.log('Auth: ', context.id)

    const existingFollower = await prisma.follower.findUnique({
      where: {
        idFollower_idFollowing: {
          idFollower,
          idFollowing
        }
      }
    });

    if (existingFollower) {
      throw new GraphQLError("Already following", {
        extensions: {
          code: "BAD_REQUEST",
          http: { status: 400 }
        }
      });
    }

    const follower = await prisma.follower.create({
      data: {
        idFollower,
        idFollowing
      },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        following: {
          select: {
            email: true,
            username: true,
            subscriptionWP: true,
            Setting: {
              select: {
                n_followers: true,
                n_email_followers: true,
              }
            }
          }
        }
      }
    })
  
    const link = `home/profile/${follower.idFollower}`

    const notification = await pushNotification({
      idUser: follower.idFollowing,
      idUserSend: follower.idFollower,
      username: follower.follower.username,
      email: follower.following.email,
      title: 'Nuevo seguidor',
      message: MESSAGE.NEW_FOLLOWER,
      subscription: follower.following.subscriptionWP,
      link,
      sendPush: follower.following.Setting.n_followers,
      sendEmail: follower.following.Setting.n_email_followers,
    })

    return follower
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

export const deleteFollower = async (_: any, {idFollower, idFollowing}: {idFollower: string, idFollowing: string}, context: Context) => {
  try {
    if (!context.auth) {
      throw new GraphQLError("Not authenticated", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 }
        }
      })
    }

    const existingFollower = await prisma.follower.findUnique({
      where: {
        idFollower_idFollowing: {
          idFollower,
          idFollowing
        }
      }
    });

    if (!existingFollower) {
      throw new GraphQLError("Not following", {
        extensions: {
          code: "NOT_FOLLOWING",
          http: { status: 400 }
        }
      });
    }

    // Eliminar el registro de seguimiento
    await prisma.follower.delete({
      where: {
        idFollower_idFollowing: {
          idFollower,
          idFollowing
        }
      }
    });

    return { message: "Unfollowed successfully" };

  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new GraphQLError("Error en la base de datos", {
        extensions: {
          code: "DATABASE_ERROR",
          http: { status: 500 }
        }
      });
    } else {
      throw new GraphQLError("Internal server error", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          http: { status: 500 }
        }
      });
    }
  }
}