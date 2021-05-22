import { ApolloError } from 'apollo-server-express';
import bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import jwt from 'jsonwebtoken';

import User from '../../models/User';
import RefreshToken from '../../models/RefreshToken';
import registerValidator from '../../utility/validation/registerValidation';
import loginValidator from '../../utility/validation/loginValidation';

const registerUser = async (parent, args, ctx, info) => {
    const name = args.name;
    const email = args.email;
    const password = args.password;

    await registerValidator(name, email, password);

    try {
        const hashedPassoword = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            id: v4(),
            name: name,
            email: email,
            password: hashedPassoword
        });
        return true;
    } catch (err) {
        throw new ApolloError('Authentication failed', 'INTERNAL_SERVER_ERROR', { error: err });
    }
}

const loginUser = async (parent, args, ctx, info) => {
    const email = args.email;
    const password = args.password;

    await loginValidator(email, password);
    console.log(email, password);

    try {
        const user = await User.findOne({ where: { email } });
        const isEqual = await bcrypt.compare(password, user.password);

        if (!isEqual) {
            throw new ApolloError('Invalid passowrd', 'AUTHENTICATION_ERROR');
        }

        const accessToken = jwt.sign(
            {
                id: user.id,
                email: user.email,
                timestamp: new Date(),
                tokentype: 'ACCESS'
            },
            process.env.ACCESS_TOKEN_KEY,
            {
                expiresIn: '15m'
            }
        );

        const expiryTime = Date.now() + 15 * 60;

        const refreshToken = jwt.sign(
            {
                id: user.id,
                timestamp: new Date(),
                tokentype: 'REFRESH'
            },
            process.env.REFRESH_TOKEN_KEY,
            {
                expiresIn: '1y'
            }
        );

        await RefreshToken.create({
            userId: user.id,
            token: refreshToken
        });

        return {
            accessToken,
            refreshToken,
            expiryTime
        }

    } catch (err) {
        if (err instanceof ApolloError) {
            throw err;
        }
        console.log(err);
        throw new ApolloError('Authentication failed', 'INTERNAL_SERVER_ERROR', { error: err });
    }
}

const generateNewToken = async (parent, args, ctx, info) => {
    const refreshToken = ctx.req.get('Authorization');

    if (!refreshToken || refreshToken === '') {
        throw new ApolloError('Unable to generate new access token', 'REFRESH_TOKEN_REQUIRED');
    }

    try {
        let userIdFromToken;

        await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (err, decodedToken) => {
            if (err) {
                throw new ApolloError('Unable to generate new access token', 'INVALID_REFRESH_TOKEN');
            } else {
                if (decodedToken.tokentype === 'ACCESS') {
                    throw new ApolloError('Unable to generate new access token', 'REFRESH_TOKEN_REQUIRED');
                }
                userIdFromToken = decodedToken.id;
            }
        });



        const user = await RefreshToken.findOne({
            attributes: ['userId'],
            where: {
                token: refreshToken
            }
        });

        if (user && user.userId === userIdFromToken) {
            const accessToken = jwt.sign(
                {
                    id: user.userId,
                    email: user.email,
                    timestamp: new Date(),
                    tokentype: 'ACCESS'
                },
                process.env.ACCESS_TOKEN_KEY,
                {
                    expiresIn: '15m'
                }
            );

            const expiryTime = Date.now() + 15 * 60;

            return {
                accessToken,
                refreshToken,
                expiryTime
            }
        } else {
            throw new ApolloError('Unable to generate new access token', 'INVALID_REFRESH_TOKEN');
        }
    } catch (err) {
        throw err;
    }
}

const logout = async (parent, args, ctx, info) => {
    if (ctx.userId === null || ctx.isAuthorised === false) {
        throw new ApolloError('User is not authenticated', ctx.authErrorCode);
    }

    try {
        const userRT = await RefreshToken.findOne({
            where: {
                userId: ctx.userId,
                token: args.refreshToken
            }
        });

        if (!userRT) {
            return false;
        }

        await userRT.destroy();

        return true;
    } catch (err) {
        throw new ApolloError('Logout failed', 'INTERNAL_SERVER_ERROR', { error: err });
    }
    return true;
}

export default {
    registerUser,
    loginUser,
    generateNewToken,
    logout
}