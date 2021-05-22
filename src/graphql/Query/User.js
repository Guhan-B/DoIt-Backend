import { ApolloError } from 'apollo-server-express';

import User from '../../models/User';

const me = async (parent, args, ctx, info) => {
    if (ctx.userId === null || ctx.isAuthorised === false) {
        throw new ApolloError('User is not authenticated', ctx.authErrorCode);
    }

    try {
        const user = await User.findOne({ where: { id: ctx.userId } });

        return {
            id: ctx.userId,
            name: user.name,
            email: user.email
        }

    } catch (err) {
        console.log(err);
        throw new ApolloError('User is not authenticated', 'INTERNAL_SERVER_ERROR');
    }
}

export default {
    me,
};