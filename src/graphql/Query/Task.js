import { ApolloError } from "apollo-server-errors";
import Log from "../../models/Log";
import Task from "../../models/Task";

const getTasks = async (parent, args, ctx, info) => {
    if (ctx.userId === null || ctx.isAuthorised === false) {
        throw new ApolloError('User is not authenticated', ctx.authErrorCode);
    }

    try {
        const log = await Log.findOne({
            where: {
                id: args.logId,
                userId: ctx.userId
            }
        });

        if(!log){
            throw new ApolloError('Log not found', 'RESOURCE_NOT_FOUND');
        }

        const tasks = await Task.findAll({
            where: {
                logId: args.logId
            }
        });

        return tasks;
    } catch (err) {
        throw new ApolloError('Unable to fetch tasks', 'INTERNAL_SERVER_ERROR', {errors: err});
    }
}

export default {
    getTasks,
}