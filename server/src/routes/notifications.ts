
import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const notification = async (req:Request, res: Response) => {
  try {
    const { pushSubscription, userId } = req.body

    const userFound = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!userFound) return res.status(404).json({ error: 'Usuario no encontrado' })
      
    const response = await prisma.user.update({
      where: { id: userFound.id},
      data: { subscriptionWP: JSON.stringify(pushSubscription)}
    })

    return res.status(200).json()
  } catch (error) {
    // console.log('Error: ', error)
    return res.status(500).json({ error })
  }
}