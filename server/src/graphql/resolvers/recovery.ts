import { Prisma, PrismaClient } from "@prisma/client"
import { GraphQLError } from "graphql"
import { generateRandomCode } from "../../lib/functions.js"
import bcrypt from 'bcrypt'
import { sendEmailService } from "../../helpers/sendMail.js"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export const sendRecoveryCode = async (_: any, {email}: {email:string}) => {
	try {
		const userFound = await prisma.user.findUnique({
      where: { email },
      select: {
        recoveryCode: true
      }
    })

    if (!userFound) {
      throw new GraphQLError('Not found', {
        extensions: {
          code: 'NOT_FOUND',
          http: { status: 404 }
        }
      })
    }

		const recoveryCode = generateRandomCode()

    await prisma.user.update({
      where: {email},
      data: {
        recoveryCode
      }
    })

		const dataToken = {
			recoveryCode,
			email
		}

		const token = jwt.sign(dataToken, process.env.SECRETTK, {
			expiresIn: '1h'
		})

		await sendEmailService({
			to: email,
			subject: 'Solicitud de restablecimiento de contraseña de la cuenta de UVM Dev',
			text: `Recientemente, hemos recibido una solicitud para recuperar la cuenta de UVM Dev ${email}\n\n\n Este es el codigo de recuperacion: ${recoveryCode}`,
			link: `${process.env.FRONTEND_URL}recovery?token=${token}`
		})

		return {response: 'OK'}
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

export const verifyCode = async (_: any, {email, code}: {email:string, code: string}) => {
	try {
		const userFound = await prisma.user.findUnique({
      where: { email },
      select: {
        recoveryCode: true
      }
    })

    if (!userFound) {
      throw new GraphQLError('Not found', {
        extensions: {
          code: 'NOT_FOUND',
          http: { status: 404 }
        }
      })
    }

    if (userFound.recoveryCode != code) {
      throw new GraphQLError('Codigo incorrecto', {
        extensions: {
          code: 'BAD_REQUEST',
          http: { status: 401 }
        }
      })
    }
    
    await prisma.user.update({
      where: {email},
      data: {
        recoveryCode: ''
      }
    })

    return {response: 'OK'}
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

export const changePassword = async (_: any, {email, password}: {email:string, password: string}) => {
	try {
		const userFound = await prisma.user.findUnique({
      where: { email }
    })

    if (!userFound) {
      throw new GraphQLError('Not found', {
        extensions: {
          code: 'NOT_FOUND',
          http: { status: 404 }
        }
      })
    }

		const isCorrect = await bcrypt.compare(password, userFound.password)

    if (isCorrect) {
      throw new GraphQLError('La contraseña debe ser diferente a la anterior', {
        extensions: {
          code: 'BAD_REQUEST',
          http: { status: 401 }
        }
      })
    }
    
  	const hashedPassword = await bcrypt.hash(password, 10)
    await prisma.user.update({
      where: {email},
      data: {
        password: hashedPassword
      }
    })

    return {response: 'OK'}
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