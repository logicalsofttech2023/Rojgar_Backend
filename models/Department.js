// models/Department.js
import { DataTypes } from "sequelize";
import sequelize from "../connection/db.js";

const Department = sequelize.define(
  "departments",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    
  },
  {
    tableName: "departments",
    timestamps: true,
  }
);

export default Department;
