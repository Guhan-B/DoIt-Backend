import { ApolloError } from 'apollo-server-express';
import { v4 } from 'uuid';
import Log from '../../models/Log';

import Task from '../../models/Task';
import createTaskValidator from '../../utility/validation/createTaskValidation';


const createTask = async (parent, args, ctx, info) => {
    if (ctx.userId === null || ctx.isAuthorised === false) {
        throw new ApolloError('User is not authenticated', ctx.authErrorCode);
    }

    await createTaskValidator(args.logId, args.title, args.priority);

    try {
        const task = await Task.create({
            id: v4(),
            logId: args.logId,
            title: args.title,
            priority: args.priority
        });

        return task;
    } catch (err) {
        if (err instanceof ApolloError) {
            throw err;
        }
        throw new ApolloError('Unable to create task', 'INTERNAL_SERVER_ERROR', { error: err });
    }

}

const deleteTask = async (parent, args, ctx, info) => {
    if (ctx.userId === null || ctx.isAuthorised === false) {
        throw new ApolloError('User is not authenticated', ctx.authErrorCode);
    }

    try {
        const log = await Log.findOne({
            where: {
                userId: ctx.userId,
                id: args.logId
            }
        });

        if(!log){
            throw new ApolloError('Log does not exist', 'RESOURCE_NOT_FOUND');
        }

        const task = await Task.findOne({
            where: {
                id: args.taskId,
                logId: args.logId
            }
        })

        if(!task){
            throw new ApolloError('Task does not exist', 'RESOURCE_NOT_FOUND');
        }

        const result = await task.destroy();

        return result;

    } catch (err) {
        if(err instanceof ApolloError){
            throw err;
        }
        throw new ApolloError('Unable to delete task', 'INTERNAL_SERVER_ERROR', { error: err });
    }
}

export default {
    createTask,
    deleteTask,
}