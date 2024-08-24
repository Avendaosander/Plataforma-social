import { Prisma, PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Context, Token } from '../../types';

const prisma = new PrismaClient();

export const getUsers = async (_: any, {}, context: Context) => {
	try {
		if (!context.auth) {
			throw new GraphQLError("Not authenticated", {
				extensions: {
					code: "UNAUTHENTICATED",
					http: { status: 401 }
				}
			})
		}

    return await prisma.user.findMany()

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

export const getUser = async (_: any, { id }: { id: string }, context: Context) => {
  if (!context.auth) {
    throw new GraphQLError('Not authenticated', {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 }
      }
    })
  }

  const userFound = await prisma.user.findUnique({ where: { id } })

  if (!userFound) {
    throw new GraphQLError('Not found', {
      extensions: {
        code: 'NOT_FOUND',
        http: { status: 404 }
      }
    })
  }
  return userFound
}

export const login = async (_: any, { email }: { email: string }) => {
  const userFound = await prisma.user.findUnique({ 
    where: { email },
    include: {
      Setting: true
    }
  })
  if (!userFound) {
    throw new GraphQLError('El usuario no fue encontrado', {
      extensions: {
        code: 'NOT_FOUND',
        http: { status: 404 }
      }
    })
  }

  const dataToken: Token = {
    id: userFound.id,
    email: userFound.email,
    username: userFound.username,
  }
  
  const token = jwt.sign(dataToken, process.env.SECRETTK, {
    expiresIn: '7d'
  })
  
  return {
    ...userFound,
    token
  }
}

export const postUser = async (_: any, { username, email, password }: { username: string, email: string, password: string }) => {
  const userFound = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { username }
      ]
    }
  })

  if (userFound) {
    if (userFound.username === username) {
      throw new GraphQLError('Nombre de usuario ya esta en uso')
    }
    if (userFound.email === email) {
      throw new GraphQLError('El correo ya esta en uso')
    }
  }
  
  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  await prisma.setting.create({
    data: {
      idUser: newUser.id
    }
  })
  return newUser
};

export const putUser = async (_: any, { id, username, description, avatar }: { id: string, username?: string, description?: string, avatar?: string }, context: Context) => {
  if (!context.auth) {
    throw new GraphQLError('Not authenticated', {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 }
      }
    })
  }
  
  const userFound = await prisma.user.findFirst({
    where: { username }
  })
  
  if (userFound) {
    if (userFound.username === username) {
      throw new GraphQLError('Nombre de usuario ya esta en uso')
    }
  }

  return await prisma.user.update({
    where: { id },
    data: { username, description, avatar },
  });
};

export const deleteUser = async (_: any, { id }: { id: string }) => {
  return await prisma.user.delete({
    where: { id },
  });
};