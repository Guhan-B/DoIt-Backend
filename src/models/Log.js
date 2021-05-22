import { DataTypes } from 'sequelize';

import database from '../utility/database';

const Log = database.define(
    'log',
    {
        id: {
            primaryKey: true,
            type: DataTypes.STRING,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
    },
    {
        tableName: 'logs',
        timestamps: false
    }
);

export default Log;