import { ApolloError } from 'apollo-server-express';
import val from 'validator';

import Log from '../../models/Log';

export default async (logId, title, priority) => {
    if (val.isEmpty(title) || val.isEmpty(logId)) {
        throw new ApolloError('Parameters cannot be empty', 'VALIDATION_ERROR');
    }

    if (priority != 0 && priority != 1 && priority != 2) {
        throw new ApolloError('Priority is invalid (Only 0 - 2 is allowed)', 'VALIDATION_ERROR');
    }

    let logExist;
    try {
        logExist = await Log.findOne({ where: { id: logId } });
    } catch (err) {
        throw new ApolloError('Internal server error', 'INTERNAL_SERVER_ERROR', { error: err });
    }

    if (!logExist) {
        throw new ApolloError('Log does not exist', 'RESOURCE_NOT_FOUND');
    }
}