import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
  "rojgar",
  "root",
  "",
  {
    host: "localhost",
    port: 3306,
    dialect: "mysql",
    dialectOptions: {
      connectTimeout: 10000,
    },
    logging: false,
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
//   "logicals_new_rojgaarr",
//   "logicals_logicals_rojgaarr",
//   "CtfMu$)5sm-p",
//   {
//     host: "157.66.191.9",
//     port: 3306,
//     dialect: "mysql",
//     dialectOptions: {
//       connectTimeout: 10000,
//     },
//     logging: false,
//   }
// );

