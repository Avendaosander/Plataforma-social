import { Prisma, PrismaClient, Technology } from "@prisma/client"
import { GraphQLError } from "graphql"
import { Context, NewTechnology, PostFilterInput } from "../../types"
import { MESSAGE, SUBSCRIPTIONS_EVENTS } from "../../lib/constant.js"
import { wsPublish } from "../../lib/functions.js"

const prisma = new PrismaClient()

export const getPosts = async (_: any, {}, context: Context) => {
	try {
		if (!context.auth) {
			throw new GraphQLError("Not authenticated", {
				extensions: {
					code: "UNAUTHENTICATED",
					http: { status: 401 }
				}
			})
		}

		const posts = await prisma.post.findMany({
			include: {
				user: true,
				Stack: {
					include: {
						tech: true
					}
				},
				Rating: true,
				_count: {
					select: {
						Comment: true,
						Post_saved: true
					}
				}
			}
		})

		const postsWithCommentCount = posts.map(post => ({
			...post,
			comments: post._count.Comment,
			saved: post._count.Post_saved
		}))

		return postsWithCommentCount
	} catch (error) {
		if (error instanceof GraphQLError) {
			// Re-lanzar errores conocidos de GraphQL
			throw error
		} else if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// Manejar errores específicos de Prisma
			throw new GraphQLError("Error en la base de datos", {
				extensions: {
					code: "DATABASE_ERROR",
					http: { status: 500 }
				}
			})
		} else {
			// Manejar errores inesperados
			throw new GraphQLError("Internal server error", {
				extensions: {
					code: "INTERNAL_SERVER_ERROR",
					http: { status: 500 }
				}
			})
		}
	}
}

export const getPostsFilter = async (
	_: any,
	{ filter }: { filter: PostFilterInput },
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
		const { idUser, title, technologies, rating } = filter

		const posts = await prisma.post.findMany({
			where: {
				...(idUser && { idUser: idUser }),
				...(title && { title: { contains: title } }),
				...(technologies &&
					technologies.length > 0 && {
						Stack: {
							some: {
								tech: {
									name: { in: technologies }
								}
							}
						}
					}),
				...(rating && {
					Rating: {
						some: {
							rating: { gte: rating }
						}
					}
				})
			},
			include: {
				user: true,
				Stack: {
					include: {
						tech: true
					}
				},
				Rating: true,
				_count: {
					select: {
						Comment: true,
						Post_saved: true
					}
				}
			}
		})

		const postsWithCommentCount = posts.map(post => ({
			...post,
			comments: post._count.Comment,
			saved: post._count.Post_saved
		}))

		return postsWithCommentCount
	} catch (error) {
		if (error instanceof GraphQLError) {
			// Re-lanzar errores conocidos de GraphQL
			throw error
		} else if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// Manejar errores específicos de Prisma
			throw new GraphQLError("Error en la base de datos", {
				extensions: {
					code: "DATABASE_ERROR",
					http: { status: 500 }
				}
			})
		} else {
			// Manejar errores inesperados
			throw new GraphQLError("Internal server error", {
				extensions: {
					code: "INTERNAL_SERVER_ERROR",
					http: { status: 500 }
				}
			})
		}
	}
}

export const getPostsUser = async (
	_: any,
	{ idUser }: { idUser: string },
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

		const posts = await prisma.post.findMany({
			where: { idUser },
			include: {
				user: true,
				Stack: {
					include: {
						tech: true
					}
				},
				Rating: true,
				_count: {
					select: {
						Comment: true,
						Post_saved: true
					}
				}
			}
		})

		const postsWithCommentCount = posts.map(post => ({
			...post,
			comments: post._count.Comment,
			saved: post._count.Post_saved
		}))

		return postsWithCommentCount
	} catch (error) {
		if (error instanceof GraphQLError) {
			// Re-lanzar errores conocidos de GraphQL
			throw error
		} else if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// Manejar errores específicos de Prisma
			throw new GraphQLError("Error en la base de datos", {
				extensions: {
					code: "DATABASE_ERROR",
					http: { status: 500 }
				}
			})
		} else {
			// Manejar errores inesperados
			throw new GraphQLError("Internal server error", {
				extensions: {
					code: "INTERNAL_SERVER_ERROR",
					http: { status: 500 }
				}
			})
		}
	}
}

export const getPost = async (
	_: any,
	{ id }: { id: string },
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

		const postFound = await prisma.post.findUnique({
			where: { id },
			include: {
				user: true,
				Comment: {
					include: {
						user: true
					}
				},
				Stack: {
					include: {
						tech: true
					}
				},
				Rating: true,
				_count: {
					select: {
						Post_saved: true
					}
				}
			}
		})
		if (!postFound) {
			throw new GraphQLError("Not found", {
				extensions: {
					code: "NOT_FOUND",
					http: { status: 404 }
				}
			})
		}
		return postFound
	} catch (error) {
		if (error instanceof GraphQLError) {
			// Re-lanzar errores conocidos de GraphQL
			throw error
		} else if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// Manejar errores específicos de Prisma
			throw new GraphQLError("Error en la base de datos", {
				extensions: {
					code: "DATABASE_ERROR",
					http: { status: 500 }
				}
			})
		} else {
			// Manejar errores inesperados
			throw new GraphQLError("Internal server error", {
				extensions: {
					code: "INTERNAL_SERVER_ERROR",
					http: { status: 500 }
				}
			})
		}
	}
}

export const postPost = async (
	_: any,
	{
		title,
		description,
		technologies,
		newTechnologies,
		files
	}: {
		title: string
		description: string
		technologies: [Technology]
		newTechnologies: [NewTechnology]
		files: [{ name: string }]
	},
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
		// console.log(title)
		// console.log(description)
		// console.log(technologies)
		// console.log(newTechnologies)
		// console.log(files)

		if (!title) {
			throw new GraphQLError("No se ha ingresado un titulo")
		}
		if (!description) {
			throw new GraphQLError("No se ha ingresado una descripcion")
		}

		const newPost = await prisma.post.create({
			data: {
				idUser: context.id,
				title,
				description
			},
			include: {
				user: {
					select: {
						username: true
					}
				}
			}
		})

		let technologiesFormated: Technology[] = [...technologies]

		if (newTechnologies) {
			console.log("entra aqui?")
			const resNewTechnologies = await prisma.technology.createMany({
				data: newTechnologies
			})

			const createdTechnologies = await prisma.technology.findMany({
				where: {
					name: {
						in: newTechnologies.map(tech => tech.name)
					}
				}
			})

			console.log("Stack: ", technologies)
			console.log("NewStack: ", createdTechnologies)

			technologiesFormated = [...technologies, ...createdTechnologies]
		}

		const stackFormated = technologiesFormated
			.filter(tech => tech.id !== "Other")
			.map(tech => ({
				idPost: newPost.id,
				idTechnology: tech.id
			}))

		console.log("Stack formated: ", stackFormated)

		const resStack = await prisma.stack.createMany({
			data: stackFormated
		})

		console.log("Resultado de Stack: ", resStack)
		await wsPublish({
			subscriptionName: SUBSCRIPTIONS_EVENTS.POST_CREATED,
			payloadName: 'postCreated',
			id: newPost.id,
			username: newPost.user.username,
			message: MESSAGE.NEW_POST,
			text: newPost.title
		})

		return newPost
	} catch (error) {
		console.log(error)
		if (error instanceof GraphQLError) {
			// Re-lanzar errores conocidos de GraphQL
			throw error
		} else if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// Manejar errores específicos de Prisma
			throw new GraphQLError("Error en la base de datos", {
				extensions: {
					code: "DATABASE_ERROR",
					http: { status: 500 }
				}
			})
		} else {
			// Manejar errores inesperados
			throw new GraphQLError("Internal server error", {
				extensions: {
					code: "INTERNAL_SERVER_ERROR",
					http: { status: 500 }
				}
			})
		}
	}
}

export const putPost = async (
	_: any,
	{
		id,
		title,
		description
	}: { id: string; title?: string; description?: string },
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
		
    const isExist = await prisma.post.findUnique({
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

		return await prisma.post.update({
			where: { id },
			data: { title, description }
		})
	} catch (error) {
		if (error instanceof GraphQLError) {
			// Re-lanzar errores conocidos de GraphQL
			throw error
		} else if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// Manejar errores específicos de Prisma
			throw new GraphQLError("Error en la base de datos", {
				extensions: {
					code: "DATABASE_ERROR",
					http: { status: 500 }
				}
			})
		} else {
			// Manejar errores inesperados
			throw new GraphQLError("Internal server error", {
				extensions: {
					code: "INTERNAL_SERVER_ERROR",
					http: { status: 500 }
				}
			})
		}
	}
}

export const deletePost = async (
	_: any,
	{ id }: { id: string },
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

    const isExist = await prisma.post.findUnique({
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

		return await prisma.post.delete({
			where: { id }
		})
	} catch (error) {
		if (error instanceof GraphQLError) {
			// Re-lanzar errores conocidos de GraphQL
			throw error
		} else if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// Manejar errores específicos de Prisma
			throw new GraphQLError("Error en la base de datos", {
				extensions: {
					code: "DATABASE_ERROR",
					http: { status: 500 }
				}
			})
		} else {
			// Manejar errores inesperados
			throw new GraphQLError("Internal server error", {
				extensions: {
					code: "INTERNAL_SERVER_ERROR",
					http: { status: 500 }
				}
			})
		}
	}
}
