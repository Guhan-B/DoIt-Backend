import { ApolloError } from 'apollo-server-express';
import { v4 } from 'uuid';

import Log from '../../models/Log';
import createLogValidator from '../../utility/validation/createLogValidation';

const createLog = async (parent, args, ctx, info) => {
    if (ctx.userId === null || ctx.isAuthorised === false) {
        throw new ApolloError('User is not authenticated', ctx.authErrorCode);
    }

    await createLogValidator(args.title);

    try {
        const log = await Log.create({
            id: v4(),
            userId: ctx.userId,
            title: args.title
        });
        return log;
    } catch (err) {
        throw new ApolloError('Unable to create log', 'INTERNAL_SERVER_ERROR', { error: err });
    }
}

const deleteLog = async (parent, args, ctx, info) => {
    if (ctx.userId === null || ctx.isAuthorised === false) {
        throw new ApolloError('User is not authenticated', ctx.authErrorCode);
    }

    try {
        const log = await Log.findOne({
            where: {
                userId: ctx.userId,
                id: args.id
            }
        })

        if (!log) {
            throw new ApolloError('Log does not exist', 'RESOURCE_NOT_FOUND');
        }

        const result = await log.destroy();

        return result;
    } catch (err) {
        if(err instanceof ApolloError){
            throw err;
        }
        throw new ApolloError('Unable to detele log', 'INTERNAL_SERVER_ERROR', { error: err });
    }

}

export default {
    createLog,
    deleteLog
}