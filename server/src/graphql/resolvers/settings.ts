import { Prisma, PrismaClient, Setting } from "@prisma/client"
import { GraphQLError } from "graphql"
import { Context } from "../../types"

const prisma = new PrismaClient()

export const getSettings = async (_: any, { idUser }: {idUser: string}, context: Context) => {
  try {
    if (!context.auth) {
      throw new GraphQLError("Not authenticated", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 }
        }
      })
    }

    const settingFound = await prisma.setting.findUnique({
      where: { idUser }
    })

    if (!settingFound) {
      throw new GraphQLError("Not found", {
        extensions: {
          code: "NOT_FOUND",
          http: { status: 404 }
        }
      })
    }

    return settingFound
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

export const putSettings = async (_: any, { data }: {data: Setting}, context: Context) => {
  try {
    if (!context.auth) {
      throw new GraphQLError("Not authenticated", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 }
        }
      })
    }

    const settingsFound = await prisma.setting.findUnique({
      where: {
        idSetting: data.idSetting
      }
    })

    if (!settingsFound) {
      throw new GraphQLError("Not found", {
        extensions: {
          code: "NOT_FOUND",
          http: { status: 404 }
        }
      })
    }

    const settings = await prisma.setting.update({
      where: { idSetting: data.idSetting },
      data
    })

    return settings
  } catch (error) {
    console.log(error)
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