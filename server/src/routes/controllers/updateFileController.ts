import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { promises as fs } from 'fs';
import path from "path";

const prisma = new PrismaClient();

export const updateFile = async(req: Request, res: Response) => {
  try {
    const { filename } = req.file;
    const { id, idPost } = req.body;

    const fileFound = await prisma.file.findUnique({
      where: { id }
    })

    const oldFilePath = fileFound.file;
      
    const file = await prisma.file.update({
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
    res.status(200).json(file);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al subir el archivo' });
  }
}