import { ApolloError } from 'apollo-server-express';
import val from 'validator';

export default async (title) => {
    if (val.isEmpty(title)) {
        throw new ApolloError('Parameters cannot be empty', 'VALIDATION_ERROR');
    }
}