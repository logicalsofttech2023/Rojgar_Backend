// models/Department.js
import { DataTypes } from "sequelize";
import sequelize from "../connection/db.js";

const Department = sequelize.define("departments", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("Active", "Inactive"),
    defaultValue: "Active",
  },
}, {
  tableName: "departments",
  timestamps: true,
});


export default Department;
