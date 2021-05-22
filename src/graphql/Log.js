import Task from "../models/Task";

const tasks = async (parent, args, ctx, info) => {
    const logId = parent.id;

    try {
        const tasks = await Task.findAll({
            attributes: ['id', 'title', 'priority'],
            where: {
                logId
            }
        });
        return tasks;
    } catch (err) {
        throw new ApolloError('Unable to fetch tasks', 'INTERNAL_SERVER_ERROR');
    }

}

export default {
    tasks,
}