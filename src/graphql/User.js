import { ApolloError } from 'apollo-server-express';

import Log from '../models/Log';

const logs = async (parent, args, ctx, info) => {
    const userId = ctx.userId;

    try {
        const logs = await Log.findAll({
            attributes: ['id', 'title'],
            where: {
                userId
            }
        });
        return logs;
    } catch (err) {
        throw new ApolloError('Unable to fetch logs', 'INTERNAL_SERVER_ERROR');
    }
}

export default {
    logs,
}