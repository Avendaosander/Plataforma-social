import { Prisma, PrismaClient } from "@prisma/client"
import { GraphQLError } from "graphql"
import { Context } from "../../types"

const prisma = new PrismaClient()

export const getPostsSaved = async (_: any, { idUser }: { idUser: string }, context: Context) => {
  try {
    if (!context.auth) {
      throw new GraphQLError("Not authenticated", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 }
        }
      })
    }

    const posts = await prisma.post_saved.findMany({
      where: { idUser },
      include: {
        post: {
          include: {
            user: true,
            Stack: {
              include: {
                tech: true
              }
            },
            File: true,
          }
        }
      }
    });

    return posts
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

export const postPostSaved = async (_: any, {idUser, idPost}: {idUser: string, idPost: string}, context: Context) => {
  try {
    if (!context.auth) {
      throw new GraphQLError("Not authenticated", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 }
        }
      })
    }

    const existingPostSaved = await prisma.post_saved.findUnique({
      where: {
        idPost_idUser: {
          idUser,
          idPost
        }
      }
    });

    if (existingPostSaved) {
      throw new GraphQLError("Already following", {
        extensions: {
          code: "ALREADY_FOLLOWING",
          http: { status: 400 }
        }
      });
    }

    const post_saved = await prisma.post_saved.create({
      data: {
        idUser,
        idPost
      }
    });

    return post_saved
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

export const deletePostSaved = async (_: any, {idUser, idPost}: {idUser: string, idPost: string}, context: Context) => {
  try {
    if (!context.auth) {
      throw new GraphQLError("Not authenticated", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 }
        }
      })
    }

    const existingFollower = await prisma.post_saved.findUnique({
      where: {
        idPost_idUser: {
          idUser,
          idPost
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
    await prisma.post_saved.delete({
      where: {
        idPost_idUser: {
          idUser,
          idPost
        }
      }
    });

    return { message: "Unsaved successfully" };

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