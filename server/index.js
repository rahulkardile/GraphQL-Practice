import express from "express"
import { ApolloServer } from "@apollo/server"
import { expressMiddleware } from "@apollo/server/express4"
import bodyParser from "body-parser"
import cors from "cors"
import axios from 'axios'

async function startServer() {

    const app = express();
    const server = new ApolloServer({

        // schema definations
        typeDefs: `
        type Todo {
            id: ID!
            title: String!
            completed: Boolean
        }

        type Query {
            getTodos: [Todo]
        }
        `,

        // logic part 
        resolvers: {
            Query: {
                getTodos: async ()=> (await axios.get('https://jsonplaceholder.typicode.com/todos')).data
            }
        },
    });

    app.use(bodyParser.json());
    app.use(cors());

    await server.start();
    app.use("/graphql", expressMiddleware(server));

    app.listen(8000, () => console.log("server is running on PORT 8000"))

}

startServer();