import { DataTypes } from "sequelize";
import sequelize from "../connection/db";

const TestUser = sequelize.define('Test_User',{




    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
        validate :{
            len:[4,255]
        }
    }
})
