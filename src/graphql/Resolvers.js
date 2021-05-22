import User from './User';
import Log from './Log';

import userQuery from './Query/User';
import logQuery from './Query/Log';
import taskQuery from './Query/Task';

import authMutation from './Mutation/Auth';
import logMutation from './Mutation/Log';
import taskMutation from './Mutation/Task';

const Mutation = {
    ...authMutation,
    ...logMutation,
    ...taskMutation,
}

const Query = {
    ...userQuery,
    ...logQuery,
    ...taskQuery,
}

export default {
    Query,
    Mutation,
    User,
    Log
}