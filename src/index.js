import { ApolloServer, ApolloError } from 'apollo-server-express';
import express from 'express';
import { v4 } from 'uuid';
import dotenv from 'dotenv';

import typeDefs from './schema/Schema';
import resolvers from './graphql/Resolvers';
import { createSchemaAssociation } from './utility/association';
import database from './utility/database';
import authenticationMiddleware from './middlewares/authentication';

const startServer = async () => {
    dotenv.config();

    const app = express();
    app.use(authenticationMiddleware);

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req, res }) => {
            const userId = req.userId;
            const isAuthorised = req.isAuthorised;
            const authErrorCode = req.errorCode;
            return { req, res, userId, isAuthorised, authErrorCode };
        },
        formatError: (err) => {
            const errorId = v4();
            console.log({ id: errorId, errors: err });
            return new ApolloError(err.message, err.extensions.code, {
                _id: errorId,
                timestamp: new Date()
            });
        }
    });

    server.applyMiddleware({
        app,
        cors: true
    });

    try {
        await createSchemaAssociation();
        const conn = await database.sync();
        app.listen(process.env.PORT, () => {
            console.log(`server started at http://localhost:${process.env.PORT}${server.graphqlPath}`);
        });
    } catch (error) {
        console.log("unable to start server");
        console.log(error);
    }
}

startServer();


// TODO
//  Queries
//      1.getTasks
