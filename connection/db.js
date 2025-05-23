import { Sequelize } from 'sequelize';
import dotenv from "dotenv";
dotenv.config();





// const sequelize = new Sequelize(process.env.DB_NAME, process.env.USER, process.env.PASS, {
//   host:  process.env.DB_HOST,
//   dialect: 'mysql',
//   logging: false
// });







const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.USER,
  process.env.PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    dialectOptions: {
      connectTimeout: 10000, // increase timeout for slow connections
    },
    logging: false, // disable query logging
  }
);



export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Database Connected...');
    await sequelize.sync();
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
};

export default sequelize;