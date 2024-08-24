import { Prisma, PrismaClient } from "@prisma/client"
import { GraphQLError } from "graphql"
import { Context } from "../../types"

const prisma = new PrismaClient()

export const getTechnologies = async (context: Context) => {
	try {
		if (!context.auth) {
			throw new GraphQLError("Not authenticated", {
				extensions: {
					code: "UNAUTHENTICATED",
					http: { status: 401 }
				}
			})
		}
		
	const technologies = await prisma.technology.findMany()

	return technologies
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
