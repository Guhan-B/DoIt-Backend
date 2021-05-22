import User from '../models/User';
import Log from '../models/Log';
import Task from '../models/Task';
import RefreshToken from '../models/RefreshToken';

export const createSchemaAssociation = async () => {
    User.hasMany(Log, {
        onDelete: 'CASCADE'
    });
    Log.belongsTo(User);

    Log.hasMany(Task, {
        onDelete: 'CASCADE'
    });
    Task.belongsTo(Log);

    User.hasMany(RefreshToken, {
        onDelete: 'CASCADE'
    });
    RefreshToken.belongsTo(User);
}

export const models = {
    User,
    Task,
    Log
}