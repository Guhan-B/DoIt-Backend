import { DataTypes } from 'sequelize';

import database from '../utility/database';

const RefreshToken = database.define('refreshtoken',
    {
        token: {
            type: DataTypes.TEXT('medium'),
            allowNull: false
        },
    },
    {
        tableName: 'refreshTokens',
        timestamps: true,
        updatedAt: false
    }
);

export default RefreshToken;