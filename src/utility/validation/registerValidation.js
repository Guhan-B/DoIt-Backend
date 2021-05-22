import { ApolloError } from 'apollo-server-express';
import val from 'validator';

import User from '../../models/User';

export default async (name, email, password) => {
    if (val.isEmpty(name) || val.isEmpty(email) || val.isEmpty(password)) {
        throw new ApolloError('Credientials cannot be empty', 'VALIDATION_ERROR');
    }

    if (!val.isEmail(email)) {
        throw new ApolloError('Email is invalid', 'VALIDATION_ERROR');
    }

    if (!val.isLength(password, { min: 6 })) {
        throw new ApolloError('Password must be minimum 6 characters', 'VALIDATION_ERROR');
    }

    let userExist;
    try {
        userExist = await User.findOne({ where: { email } });
    } catch (err) {
        throw new ApolloError('Internal server error', 'INTERNAL_SERVER_ERROR', { error: err });
    }

    if (userExist) {
        throw new ApolloError('Email already registered', 'VALIDATION_ERROR');
    }
}