import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { promises as fs } from 'fs';
import path from "path";

const prisma = new PrismaClient();

export const uploadFile = async(req: Request, res: Response) => {
  try {
    const { filename } = req.file;
    const { id, idPost } = req.body;

    const postFound = await prisma.post.findUnique({ where: { id } });

    if (!postFound) {
      return res.status(404).json({ error: 'Componente no encontrado' });
    }

    const oldFilePath = postFound.preview;

    const post = await prisma.file.update({
      where: { id, idPost },
      data: { file: filename },
    });

    if (oldFilePath) {
      const fullPath = path.resolve(`uploads/files/${oldFilePath}`);
      // console.log('fullPath: ', fullPath)
      try {
        await fs.access(fullPath)
        await fs.unlink(fullPath)
      } catch (err) {
        console.error(`No se pudo eliminar el archivo: ${fullPath}`, err);
      }
    }

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el preview' });
  }
}