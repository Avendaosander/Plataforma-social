import express from "express"
import morgan from "morgan"
import cors from "cors"
import path from "path"
import jwt from "jsonwebtoken"
import { fileURLToPath } from "url"
import { ApolloServer } from "@apollo/server"
import { createServer } from "http"
import { expressMiddleware } from "@apollo/server/express4"
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"
import { makeExecutableSchema } from "@graphql-tools/schema"
import { PrismaClient } from "@prisma/client"  
import { WebSocketServer } from 'ws' ;   
import { useServer } from 'graphql-ws/lib/use/ws' ; 
import { typeDefs } from "./graphql/typeDefs.js"
import { resolvers } from "./graphql/resolvers/index.js"
import { insertTechs } from "./helpers/insertData.js"
import { Context, Token } from "./types.js"
import router from "./routes/uploads.js"
import { defaultData } from "./helpers/insertDefaultData.js"
await insertTechs()
await defaultData()

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PORT = process.env.PORT || 4005

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express()
const httpServer = createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer<Context>({
	schema,
	csrfPrevention: false,
	plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
	formatError: error => {
		// Registro del error en la consola o archivo de registro (log file)
		console.error("Error en Apollo Server: ", error)
		return error
	},
	introspection: true,
})

const main = async () => {
	await server.start()

	app.use(express.json())
	app.use(express.urlencoded({ extended: true }))
	app.use(morgan("dev"))
	app.use(cors())

	app.use("/uploads", router)
	app.use(
		"/graphql",
		expressMiddleware(server, {
			context: async ({ req }) => {
				const { authorization } = req.headers
				const accessToken = authorization ? authorization.split(' ')[1] : null
				
				if (accessToken) {
					const decoded = jwt.verify(accessToken, process.env.SECRETTK) as Token
					
					const user = await prisma.user.findUnique({ where: { id: decoded.id }})
					if (user) {
						return { id: user.id, auth: true}
					}

					return { id: '', auth: false }
				}
				return { id: '', auth: false }
			}
		})
	)

	app.use("/uploads", express.static(path.join(__dirname, "../uploads")))

	httpServer.listen(PORT, () => {
		console.log(`Server running in port http://localhost:${PORT}/graphql`)
		console.log(`Web Sockets running in port ws://localhost:${PORT}/graphql`)
	})
}

main()
