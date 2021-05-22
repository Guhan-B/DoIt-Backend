import { ApolloError } from 'apollo-server-express';

import Log from '../../models/Log';

const getLogs = async (parent, args, ctx, info) => {
    if (ctx.userId === null || ctx.isAuthorised === false) {
        throw new ApolloError('User is not authenticated', ctx.authErrorCode);
    }

    try {
        const logs = await Log.findAll({
            attributes: ['id', 'title'],
            where: {
                userId: ctx.userId
            }
        });
        return logs;
    } catch (err) {
        throw new ApolloError('Unable to fetch logs', 'INTERNAL_SERVER_ERROR');
    }
}

export default {
    getLogs,
};