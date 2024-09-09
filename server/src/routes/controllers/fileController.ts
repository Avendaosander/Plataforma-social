import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const uploadFile = async(req: Request, res: Response) => {
  try {
    const { filename } = req.file;
    const { idPost } = req.body;

    const post = await prisma.file.create({
      data: { 
        idPost,
        file: filename
      },
    });
    
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al subir el archivo' });
  }
}