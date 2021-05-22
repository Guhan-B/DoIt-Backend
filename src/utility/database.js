import { Sequelize } from 'sequelize';

const database = new Sequelize('doit-dev', 'root', 'Guhan@2001', {
    dialect: 'mysql',
    host: 'localhost',
});

export default database;