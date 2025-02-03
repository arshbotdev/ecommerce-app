import {Sequelize} from "sequelize";
import mysql2 from "mysql2";

const sequelize = new Sequelize('ecommerce', 'root', '', {
    host: 'localhost',
    dialect:'mysql',
    dialectModule: mysql2,

});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });
export default sequelize;
