import { Prisma, PrismaClient } from "@prisma/client"
import { GraphQLError } from "graphql"
import { Context } from "../../types"

const prisma = new PrismaClient()

export const postRating = async (
	_: any,
	{ idPost, idUser, rating }: { idPost: string; idUser: string, rating: number },
	context: Context
) => {
  try {
    if (!context.auth) {
      throw new GraphQLError("Not authenticated", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 }
        }
      })
    }

    const ratingFound = await prisma.rating.findFirst({
      where: {
        idPost,
        idUser
      }
    })

    if (ratingFound) {
      throw new GraphQLError("Already rated", {
        extensions: {
          code: "BAD_REQUEST",
          http: { status: 400 }
        }
      })
    }

    const nweRating = await prisma.rating.create({
      data: {
        idPost,
        idUser,
        rating
      }
    })

    return nweRating
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

export const putRating = async (
	_: any,
	{ idPost, idUser, rating }: { idPost: string; idUser: string, rating: number },
	context: Context
) => {
  try {
    if (!context.auth) {
      throw new GraphQLError("Not authenticated", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 }
        }
      })
    }

    const ratingFound = await prisma.rating.findFirst({
      where: {
        idPost,
        idUser
      }
    })

    if (!ratingFound) {
      throw new GraphQLError("Calificacion no encontrada")
    }

    const ratingUpdate = await prisma.rating.update({
      where: {
        idPost_idUser: {
          idPost,
          idUser
        }
      },
      data: { rating }
    })

    return ratingUpdate
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

export const deleteRating = async (
	_: any,
	{ idPost, idUser }: { idPost: string; idUser: string },
	context: Context
) => {
  try {
    if (!context.auth) {
      throw new GraphQLError("Not authenticated", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 }
        }
      })
    }

    const ratingFound = await prisma.rating.findFirst({
      where: {
        idPost,
        idUser
      }
    })

    if (!ratingFound) {
      throw new GraphQLError("Not found", {
        extensions: {
          code: "NOT_FOUND",
          http: { status: 404 }
        }
      })
    }

    const ratingDeleted = await prisma.rating.delete({
      where: {
        idPost_idUser: {
          idPost,
          idUser
        }
      },
    })

    return ratingDeleted
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