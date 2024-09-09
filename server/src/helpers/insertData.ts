import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const technologies = [
  {
    name: 'ReactJs'
  },
  {
    name: 'Angular'
  },
  {
    name: 'VueJs'
  },
  {
    name: 'Svelte'
  },
  {
    name: 'AlpineJs'
  },
  {
    name: 'Lit'
  },
  {
    name: 'Preact'
  },
  {
    name: 'SolidJs'
  },
  {
    name: 'TailwindCSS'
  },
  {
    name: 'Bootstrap'
  },
  {
    name: 'Bulma'
  },
  {
    name: 'Framer Motion'
  },
  {
    name: 'AnimeJs'
  },
  {
    name: 'ThreeJs'
  },
  {
    name: 'ChartJs'
  }
];


export const insertTechs = async () => {
  const existingTech = await prisma.technology.findMany()

  if (existingTech.length === 0) {
    for (const tech of technologies) {
      const createdTech = await prisma.technology.create({
        data: tech,
      });

      console.log(createdTech)
    }
  }
}