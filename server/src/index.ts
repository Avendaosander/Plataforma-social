import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './graphql/typeDefs.js';
import { resolvers } from './graphql/resolvers/index.js';

const app = express()
const PORT = process.env.PORT || 4005;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const main = async() => {
  await server.start()
  
  app.use(express.json())
  app.use(morgan('dev'))
  app.use(cors())

  app.use('/graphql', expressMiddleware(server))
}

main().then(()=>{
  app.listen(PORT, ()=>{console.log(`Server running in port http://localhost:${PORT}`)})
})


