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

        type User {
            id: ID!,
            name: String!,
            email: String!
            website: String!
            phone: String!
        }

        type Query {
            getTodos: [Todo]
            getAllUser: [User]
            getUser(id: ID!): User
        }`,

        // logic part 
        resolvers: {
            Query: {
                getTodos: async () => (await axios.get('https://jsonplaceholder.typicode.com/todos')).data,
                getAllUser: async () => (await axios.get('https://jsonplaceholder.typicode.com/users')).data,
                getUser: async (parent, { id }) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data,
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