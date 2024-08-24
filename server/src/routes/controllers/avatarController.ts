import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { promises as fs } from 'fs';
import path from "path";

const prisma = new PrismaClient();

export const uploadAvatar = async(req: Request, res: Response) => {
  try {
    const { filename } = req.file;
    const { id } = req.body;
    // console.log('filename:', filename)

    const userFound = await prisma.user.findUnique({ where: { id } });

    if (!userFound) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const oldAvatarPath = userFound.avatar;

    const user = await prisma.user.update({
      where: { id },
      data: { avatar: filename },
    });

    if (oldAvatarPath) {
      const fullPath = path.resolve(`uploads/avatar/${oldAvatarPath}`);
      // console.log('fullPath: ', fullPath)
      try {
        await fs.access(fullPath)
        await fs.unlink(fullPath)
      } catch (err) {
        console.error(`No se pudo eliminar el archivo: ${fullPath}`, err);
      }
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el avatar' });
  }
}