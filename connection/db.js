import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

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
    console.log("MySQL Database Connected...");
    await sequelize.sync();
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};

export default sequelize;


// const sequelize = new Sequelize(
//   "logicals_new_rojgaarr", // database name
//   "logicals_logicals_rojgaarr", // username
//   "CtfMu$)5sm-p", // password
//   {
//     host: "localhost", // database host
//     port: 3306, // database port (as number)
//     dialect: "mysql",
//     dialectOptions: {
//       connectTimeout: 10000, // increase timeout for slow connections
//     },
//     logging: process.env.NODE_ENV === "development" ? console.log : false,
//     pool: {
//       max: 5,
//       min: 0,
//       acquire: 30000,
//       idle: 10000,
//     },
//   }
// );
