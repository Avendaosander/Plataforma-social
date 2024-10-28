import { File, Prisma, PrismaClient, Stack, Technology } from "@prisma/client"
import { GraphQLError } from "graphql"
import { Context, NewTechnology, PostFilterInput } from "../../types"
import { promises as fs } from 'fs';
import path from "path"
import { pushNotification } from "../../lib/functions.js";
import { MESSAGE } from "../../lib/constant.js";

const prisma = new PrismaClient()

export const getPosts = async (_: any, {cursor, take}: {cursor?: string, take?: number}, context: Context) => {
	try {
		if (!context.auth) {
			throw new GraphQLError("Not authenticated", {
				extensions: {
					code: "UNAUTHENTICATED",
					http: { status: 401 }
				}
			})
		}
		const limit = take || 5;

		const posts = await prisma.post.findMany({
			where: cursor ? {
				createdAt: {
					lt: new Date(parseInt(cursor))
				},
			} : undefined,
			include: {
				user: true,
				Stack: {
					include: {
						tech: true,
					},
				},
				_count: {
					select: {
						Comment: true,
						Post_saved: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
			take: limit + 1
		});

		const hasMore = posts.length > limit

		const limitedPosts = hasMore ? posts.slice(0, limit) : posts

		const postsWithDetails = await Promise.all(
			limitedPosts.map(async (post) => {
				const averageRating = await prisma.rating.aggregate({
					where: {
						idPost: post.id,
					},
					_avg: {
						rating: true
					}
				})

				const isFollowing = await prisma.follower.findUnique({
					where: {
						idFollower_idFollowing: {
							idFollower: context.id,
							idFollowing: post.user.id,
						},
					},
				});

				const isSaved = await prisma.post_saved.findUnique({
					where: {
						idPost_idUser: {
							idPost: post.id,
							idUser: context.id,
						},
					},
				});
		
				return {
					...post,
					comments: post._count.Comment,
					saved: post._count.Post_saved,
					rating: averageRating._avg.rating?.toFixed(1) || 0,
					isFollowing: !!isFollowing,
					isSaved: !!isSaved,
				};
			})
		);
		return {
			posts: postsWithDetails,
			cursor: limitedPosts.length > 0 ? limitedPosts[limitedPosts.length - 1].createdAt.getTime().toString() : null,
			hasMore
		}
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

export const getPostsFollowings = async (_: any, {cursor, take}: {cursor?: string, take?: number}, context: Context) => {
	try {
		if (!context.auth) {
			throw new GraphQLError("Not authenticated", {
				extensions: {
					code: "UNAUTHENTICATED",
					http: { status: 401 }
				}
			})
		}
		
		const limit = take || 5;

		const posts = await prisma.post.findMany({
			where: {
				idUser: {
					in: (
						await prisma.follower.findMany({
							where: {
								idFollower: context.id,
							},
							select: {
								idFollowing: true,
							},
						})
					).map(follower => follower.idFollowing),
				},
				...(cursor && {
					createdAt: {
						lt: new Date(parseInt(cursor)),
					},
				}),
			},
			include: {
				user: true,
				Stack: {
					include: {
						tech: true,
					},
				},
				_count: {
					select: {
						Comment: true,
						Post_saved: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
			take: limit + 1
		})

		const hasMore = posts.length > limit;

		const limitedPosts = hasMore ? posts.slice(0, limit) : posts;

		const postsWithDetails = await Promise.all(
			limitedPosts.map(async (post) => {
				const averageRating = await prisma.rating.aggregate({
					where: {
						idPost: post.id,
					},
					_avg: {
						rating: true
					}
				})

				const isFollowing = await prisma.follower.findUnique({
					where: {
						idFollower_idFollowing: {
							idFollower: context.id,
							idFollowing: post.user.id,
						},
					},
				});

				const isSaved = await prisma.post_saved.findUnique({
					where: {
						idPost_idUser: {
							idPost: post.id,
							idUser: context.id,
						},
					},
				});
		
				return {
					...post,
					comments: post._count.Comment,
					saved: post._count.Post_saved,
					rating: averageRating._avg.rating?.toFixed(1) || 0,
					isFollowing: !!isFollowing,
					isSaved: !!isSaved,
				};
			})
		)
		
		return {
			posts: postsWithDetails,
			cursor: limitedPosts.length > 0 ? limitedPosts[limitedPosts.length - 1].createdAt.getTime().toString() : null,
			hasMore
		}
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
	{filter, cursor, take}: {filter: PostFilterInput, cursor?: string, take?: number},
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
		const { title, technology, user, rating } = filter

		const limit = take || 5;

		const posts = await prisma.post.findMany({
			where: {
				...(title && { title: { contains: title } }),
				...(technology && {
						Stack: {
							some: {
								tech: {
									name: { contains: technology }
								}
							}
						}
					}
				),
				...(user && { user: { username: {contains: user} } }),
				...(cursor && {
					createdAt: {
						lt: new Date(parseInt(cursor)),
					},
				}),
			},
			include: {
				user: true,
				Stack: {
					include: {
						tech: true,
					},
				},
				_count: {
					select: {
						Comment: true,
						Post_saved: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
			take: limit + 1
		})
		
		const hasMore = posts.length > limit;

		const limitedPosts = hasMore ? posts.slice(0, limit) : posts;

		const postsWithDetails = await Promise.all(
			limitedPosts.map(async (post) => {
				const averageRating = await prisma.rating.aggregate({
					where: {
						idPost: post.id,
					},
					_avg: {
						rating: true
					}
				})

				if (rating && averageRating._avg.rating < rating) {
					return null
				}

				const isFollowing = await prisma.follower.findUnique({
					where: {
						idFollower_idFollowing: {
							idFollower: context.id,
							idFollowing: post.user.id,
						},
					},
				});

				const isSaved = await prisma.post_saved.findUnique({
					where: {
						idPost_idUser: {
							idPost: post.id,
							idUser: context.id,
						},
					},
				});
		
				return {
					...post,
					comments: post._count.Comment,
					saved: post._count.Post_saved,
					rating: averageRating._avg.rating?.toFixed(1) || 0,
					isFollowing: !!isFollowing,
					isSaved: !!isSaved,
				};
			})
		);
		
		return {
			posts: postsWithDetails.filter((post) => post !== null),
			cursor: limitedPosts.length > 0 ? limitedPosts[limitedPosts.length - 1].createdAt.getTime().toString() : null,
			hasMore
		}
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
	{ idUser, cursor, take }: { idUser: string, cursor?: string, take?: number },
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

		const limit = take || 5;

		const posts = await prisma.post.findMany({
			where: { 
				idUser,
				...(cursor && {
					createdAt: {
						lt: new Date(parseInt(cursor)),
					},
				}),
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
			},
			orderBy: {
				createdAt: "desc"
			},
			take: limit + 1
		})

		const hasMore = posts.length > limit;

		const limitedPosts = hasMore ? posts.slice(0, limit) : posts;

		const postsWithDetails = await Promise.all(
			limitedPosts.map(async (post) => {
				const averageRating = await prisma.rating.aggregate({
					where: {
						idPost: post.id,
					},
					_avg: {
						rating: true
					}
				})

				const isSaved = await prisma.post_saved.findUnique({
					where: {
						idPost_idUser: {
							idPost: post.id,
							idUser: context.id,
						},
					},
				});
		
				return {
					...post,
					comments: post._count.Comment,
					saved: post._count.Post_saved,
					rating: averageRating._avg.rating?.toFixed(1) || 0,
					isSaved: !!isSaved,
				};
			})
		);
		
		return {
			posts: postsWithDetails,
			cursor: limitedPosts.length > 0 ? limitedPosts[limitedPosts.length - 1].createdAt.getTime().toString() : null,
			hasMore
		}
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

export const getPostsPopulate = async (
  _: any,
  { cursor, take }: { cursor?: string; take?: number },
  context: Context
) => {
  try {
    if (!context.auth) {
      throw new GraphQLError("Not authenticated", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 },
        },
      });
    }

    const limit = take || 5;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

		const popularPosts = await prisma.post.findMany({
			where: {
				Rating: {
					some: {
						rating: {
							gte: 3,
						},
						createdAt: {
							gte: thirtyDaysAgo,
						},
					},
				},
				...(cursor && {
					createdAt: {
						lt: new Date(parseInt(cursor)),
					},
				}),
			},
			include: {
				user: true,
				Stack: {
					include: {
						tech: true,
					},
				},
				Rating: true,
				_count: {
					select: {
						Comment: true,
						Post_saved: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
			take: limit + 1
		});

    const hasMore = popularPosts.length > limit;
    const limitedPosts = hasMore ? popularPosts.slice(0, limit) : popularPosts;

    const postsWithDetails = await Promise.all(
      limitedPosts.map(async (post) => {
        const averageRating = await prisma.rating.aggregate({
					where: {
						idPost: post.id,
					},
					_avg: {
						rating: true
					}
        })
				const highRatings = post.Rating.filter(
          (rating) => rating.rating >= 3 && rating.createdAt >= thirtyDaysAgo
        )
        const totalRating = highRatings.reduce((sum, rating) => sum + rating.rating, 0)

        const isFollowing = await prisma.follower.findUnique({
          where: {
            idFollower_idFollowing: {
              idFollower: context.id,
              idFollowing: post.user.id,
            },
          },
        })

        const isSaved = await prisma.post_saved.findUnique({
          where: {
            idPost_idUser: {
              idPost: post.id,
              idUser: context.id,
            },
          },
        });

        return {
          ...post,
          comments: post._count.Comment,
          saved: post._count.Post_saved,
          rating: averageRating._avg.rating?.toFixed(1) || 0,
					totalRating,
          isFollowing: !!isFollowing,
          isSaved: !!isSaved,
        };
      })
    );

		const sortedPosts = postsWithDetails.sort((a, b) => b.totalRating - a.totalRating)

    return {
      posts: sortedPosts,
      cursor:
        limitedPosts.length > 0
          ? limitedPosts[limitedPosts.length - 1].createdAt
              .getTime()
              .toString()
          : null,
      hasMore,
    };
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new GraphQLError("Error en la base de datos", {
        extensions: {
          code: "DATABASE_ERROR",
          http: { status: 500 },
        },
      });
    } else {
      throw new GraphQLError("Internal server error", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          http: { status: 500 },
        },
      });
    }
  }
};

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
					},
					orderBy: {
						createdAt: "desc"
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
						Rating: true,
						Post_saved: true
					}
				},
				File: true
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

		const averageRating = await prisma.rating.aggregate({
			where: {
				idPost: postFound.id,
			},
			_avg: {
				rating: true
			}
		})

		const isSaved = await prisma.post_saved.findUnique({
			where: {
				idPost_idUser: {
					idPost: postFound.id,
					idUser: context.id,
				},
			},
		});

		const myRating = await prisma.rating.findUnique({
			where: {
				idPost_idUser: {
					idPost: postFound.id,
					idUser: context.id
				}
			}
		})

		return {
			...postFound,
			rating: averageRating._avg.rating?.toFixed(1) || 0,
			isSaved: !!isSaved,
			myRating: myRating
		}
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
	}: {
		title: string
		description: string
		technologies: [Technology]
		newTechnologies: [NewTechnology?]
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

		if (newTechnologies.length >= 1) {
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

			// console.log("Stack: ", technologies)
			// console.log("NewStack: ", createdTechnologies)

			technologiesFormated = [...technologies, ...createdTechnologies]
		}

		const stackFormated = technologiesFormated
			.filter(tech => tech.id !== "Other")
			.map(tech => ({
				idPost: newPost.id,
				idTechnology: tech.id
			}))

		// console.log("Stack formated: ", stackFormated)

		const resStack = await prisma.stack.createMany({
			data: stackFormated
		})

		// console.log("Resultado de Stack: ", resStack)
		const followers = await prisma.follower.findMany({
			where: {
				idFollowing: context.id
			},
			include: {
        follower: {
          select: {
            id: true,
            username: true,
						email: true,
						subscriptionWP: true,
						Setting: {
							select: {
								n_new_post: true,
								n_email_new_post: true
							}
						}
          }
        },
        following: {
          select: {
            username: true,
						avatar: true,
            subscriptionWP: true,
          }
        }
			}
		})

		await Promise.all(
			followers.map(async follower => {
			
				const link = `home/post/${newPost.id}`
				const notification = await pushNotification({
					idUser: follower.idFollower,
					idUserSend: follower.idFollowing,
					username: follower.following.username,
					email: follower.follower.email,
					title: "Componente nuevo",
					message: MESSAGE.NEW_POST,
					link,
					subscription: follower.follower.subscriptionWP,
					message2: newPost.title,
					sendPush: follower.follower.Setting.n_new_post,
					sendEmail: follower.follower.Setting.n_email_new_post,
				})
			})
		)


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
		description,
		technologies,
		newTechnologies,
		filesDelete
	}: {
		id: string
		title?: string
		description?: string
		technologies: [Technology]
		newTechnologies: [NewTechnology?]
		filesDelete: [File?]
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
		
    const postFound = await prisma.post.findUnique({
      where: { id },
			include: {
				user: {
					select: {
						username: true
					}
				},
				Stack: {
					include: {
						tech: true
					}
				}
			}
    })
  
    if (!postFound) {
      throw new GraphQLError('Not found', {
        extensions: {
          code: 'NOT_FOUND',
          http: { status: 404 }
        }
      })
    }

		let newStack: Stack[] = []

		technologies.forEach(async tech => {
			const found = postFound.Stack.some(technology => technology.idTechnology === tech.id)
			if (!found) {
				newStack.push({
					idPost: id,
					idTechnology: tech.id
				})
			}
		})

		if (newTechnologies.length >= 1) {
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

			createdTechnologies
				.map(tech => (
					newStack.push({
						idPost: postFound.id,
						idTechnology: tech.id
					})
				))
		}

		const stackFormated = newStack
			.filter(tech => tech.idTechnology !== "Other")
			.map(tech => ({
				idPost: postFound.id,
				idTechnology: tech.idTechnology
			}))

		if (stackFormated.length >= 1) {
			const res = await prisma.stack.createMany({
				data: stackFormated
			})
		}

		postFound.Stack.forEach(async tech => {
			const found = technologies.some(technology => technology.id === tech.idTechnology)
			if (!found) {
				await prisma.stack.delete({
					where: {
						idPost_idTechnology: {
							idPost: id,
							idTechnology: tech.idTechnology
						}
					}
				})
			}
		})

		if (filesDelete && filesDelete.length >= 1) {
			filesDelete.forEach(async file => {
				await prisma.file.delete({
					where: {
						id: file.id
					}
				})
				const fullPath = path.resolve(`uploads/files/${file.file}`);
      // console.log('fullPath: ', fullPath)
				try {
					await fs.access(fullPath)
					await fs.unlink(fullPath)
				} catch (err) {
					console.error(`No se pudo eliminar el archivo: ${fullPath}`, err);
				}
			})
		}
		
		const saved = await prisma.post_saved.findMany({
			where: { idPost: id },
			include: {
        post: {
          include: {
            user: {
              select: {
								username: true,
              }
            }
          }
        },
				user: {
					select: {
						username: true,
						email: true,
						subscriptionWP: true,
						Setting: {
							select: {
								n_delete_post: true,
								n_email_delete_post: true
							}
						}
					}
				}
      }
		})

		await Promise.all(
			saved.map(async user => {
				const link = `home/profile/${user.idUser}?filter=postsSaved`

				const notification = await pushNotification({
					idUser: user.idUser,
					idUserSend: user.post.idUser,
					username: user.post.user.username,
					email: user.user.email,
					title: "Componente modificado",
					message: MESSAGE.UPDATE_POST,
					link,
					subscription: user.user.subscriptionWP,
					message2: postFound.title,
					sendPush: user.user.Setting.n_delete_post,
					sendEmail: user.user.Setting.n_email_delete_post,
				})
			})
		)

		let body : {
			title?: string,
			description?: string
		} = {}
		if (title) body.title = title
		if (description) body.description = description

		if (Object.keys(body).length >= 1) {
			return await prisma.post.update({
				where: { id },
				data: { title, description },
			})
		}

		return await prisma.post.findUnique({
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
      where: { id },
			include: {
				File: true
			}
    })
  
    if (!isExist) {
      throw new GraphQLError('Not found', {
        extensions: {
          code: 'NOT_FOUND',
          http: { status: 404 }
        }
      })
    }

		const previewPath = isExist.preview
		const filePaths = isExist.File

		if (filePaths.length >= 1) {
			filePaths.forEach(async file => {
				const fullPath = path.resolve(`uploads/files/${file.file}`);
				// console.log('fullPath: ', fullPath)
				try {
					await fs.access(fullPath)
					await fs.unlink(fullPath)
				} catch (err) {
					console.error(`No se pudo eliminar el archivo: ${fullPath}`, err);
				}
			})
    }

		if (previewPath) {
			const fullPath = path.resolve(`uploads/preview/${previewPath}`);
			// console.log('fullPath: ', fullPath)
			try {
				await fs.access(fullPath)
				await fs.unlink(fullPath)
			} catch (err) {
				console.error(`No se pudo eliminar el archivo: ${fullPath}`, err);
			}
    }

		const saved = await prisma.post_saved.findMany({
			where: { idPost: id },
			include: {
        post: {
          include: {
            user: {
              select: {
								username: true,
                subscriptionWP: true
              }
            }
          }
        },
        user: {
          select: {
            username: true,
						email: true,
						subscriptionWP: true,
						Setting: {
							select: {
								n_delete_post: true,
								n_email_delete_post: true
							}
						}
          }
        }
      }
		})

		await Promise.all(
			saved.map(async user => {
			
				const link = `home/profile/${user.idUser}?filter=postsSaved`
				const notification = await pushNotification({
					idUser: user.idUser,
					idUserSend: user.post.idUser,
					username: user.post.user.username,
					email: user.user.email,
					title: "Componente eliminado",
					message: MESSAGE.DELETE_POST,
					link,
					subscription: user.user.subscriptionWP,
					message2: isExist.title,
					sendPush: user.user.Setting.n_delete_post,
					sendEmail: user.user.Setting.n_email_delete_post,
				})
			})
		)

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
