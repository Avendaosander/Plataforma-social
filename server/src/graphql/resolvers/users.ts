import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const getUsers = async () => {
  return await prisma.user.findMany()
}

export const getUser = async (_: any, { id }: { id: string }) => {
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
  return userFound
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

export const putUser = async (_: any, { id, username, description, avatar }: { id: string, username?: string, description?: string, avatar?: string }) => {
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