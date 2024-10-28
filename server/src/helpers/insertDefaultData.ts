import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = array.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

const startDate = new Date('2020-01-01')
const endDate = new Date()

export const defaultData = async () => {
  try {
    const userCount = await prisma.user.count();

    if (userCount < 2) {
      const testPassword = '123'
      const hashedPassword = await bcrypt.hash(testPassword, 10);

      const newUsers = Array.from({ length: 20 }, (_, index) => ({
        email: `user${index + 1}@gmail.com`,
        username: `user${index + 1}`,
        password: hashedPassword,
        description: `This is user ${index + 1}`,
        avatar: `avatar${index + 1}.png`,
      }));

      // Inserción de los usuarios
      await prisma.user.createMany({
        data: newUsers,
      });

      const usersCreated = await prisma.user.findMany({
        select: { id: true, username: true },
      });

      const usersID = usersCreated.map(user => ({ idUser: user.id }));

      await prisma.setting.createMany({
        data: usersID,
      });

      let postCounter = 1

			const posts = usersCreated.flatMap((user) => {
				// Generar un número aleatorio de publicaciones entre 2 y 10 para cada usuario
				const numberOfPosts = Math.floor(Math.random() * (5 - 2 + 1)) + 2;

				return Array.from({ length: numberOfPosts }, () => {
					const postName = `post${postCounter}`
					postCounter++

					return {
						idUser: user.id,
						title: postName, // Título y preview con el mismo nombre
						description: `Description for ${postName} of user ${user.username}`,
						preview: `${postName}.png`, // Preview con el mismo nombre que el título
						createdAt: getRandomDate(startDate, endDate),
					};
				});
			});

      // Inserción de las publicaciones en Prisma
      await prisma.post.createMany({
        data: posts,
      });

      const technologies = await prisma.technology.findMany({
        select: { id: true },
      });

      const postsCreated = await prisma.post.findMany({
        select: { id: true, title: true, createdAt: true },
      });

      const stacks = postsCreated.flatMap((post) => {
        // Generar un número aleatorio de tecnologías entre 1 y 4 para cada publicación
        const numberOfTechnologies = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
        
        // Seleccionar tecnologías aleatorias
        const selectedTechnologies = getRandomItems(technologies, numberOfTechnologies);

        return selectedTechnologies.map((tech) => ({
          idPost: post.id,
          idTechnology: tech.id,
        }));
      });

      // Inserción de los stacks en Prisma
      await prisma.stack.createMany({
        data: stacks,
      });

      // Generar comentarios
      const comments = postsCreated.flatMap((post) => {
        // Seleccionar al menos 5 usuarios para comentar en cada publicación
        const selectedUsers = getRandomItems(usersCreated, Math.min(4, usersCreated.length));
        const datePost = new Date (post.createdAt.toISOString().split('T')[0])

        return selectedUsers.map((user, index) => ({
          idPost: post.id,
          idUser: user.id,
          text: `Comment ${index + 1} on post ${post.title} by user ${user.username}`,
          createdAt: getRandomDate(datePost, endDate),
        }));
      });

      // Inserción de los comentarios en Prisma
      await prisma.comment.createMany({
        data: comments,
      });

      // Generar seguidores
      const followers = usersCreated.flatMap((follower) => {
        // Seleccionar un número aleatorio de usuarios para seguir (evitar que un usuario se siga a sí mismo)
        const numberOfFollowings = Math.floor(Math.random() * (usersCreated.length - 1)) + 1;
        const potentialFollowings = usersCreated.filter(user => user.id !== follower.id);

        const selectedFollowings = getRandomItems(potentialFollowings, numberOfFollowings);

        return selectedFollowings.map((following) => ({
          idFollower: follower.id,
          idFollowing: following.id,
        }));
      });

      // Inserción de los seguidores en Prisma
      await prisma.follower.createMany({
        data: followers,
      });

      // Generar posts guardados
      const postsIDs = postsCreated.map(post => post.id);
      const postSaved = usersCreated.flatMap((user) => {
        // Seleccionar un número aleatorio de posts para guardar (de 1 a 5)
        const numberOfPostsSaved = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
        const selectedPosts = getRandomItems(postsIDs, numberOfPostsSaved);

        return selectedPosts.map((postID) => ({
          idUser: user.id,
          idPost: postID,
          createdAt: getRandomDate(startDate, endDate)
        }));
      });

      // Inserción de los posts guardados en Prisma
      await prisma.post_saved.createMany({
        data: postSaved,
      });

      // Generar calificaciones
      const ratings = usersCreated.flatMap((user) => {
        // Seleccionar un número aleatorio de posts para calificar (de 1 a 5)
        const numberOfRatings = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
        const selectedPosts = getRandomItems(postsIDs, numberOfRatings);

        return selectedPosts.map((postID) => ({
          idPost: postID,
          idUser: user.id,
          rating: parseFloat((Math.random() * 5).toFixed(1)),
          createdAt: getRandomDate(startDate, endDate)
        }));
      });

      // Inserción de las calificaciones en Prisma
      await prisma.rating.createMany({
        data: ratings,
      });

      // Generar archivos para cada post
      const files = postsCreated.map((post) => ({
        idPost: post.id,
        file: `${post.title}.tsx`, // Puedes ajustar la extensión si deseas otro formato
      }));

      // Inserción de los archivos en Prisma
      await prisma.file.createMany({
        data: files,
      });

      console.log('Datos por defecto insertados');
    }
  } catch (error) {
    console.error('Error al insertar datos por defecto: ', error);
  } finally {
    await prisma.$disconnect();
  }
};
