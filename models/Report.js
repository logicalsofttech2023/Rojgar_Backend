import { DataTypes } from "sequelize";
import sequelize from "../connection/db.js";

const Report = sequelize.define("reported", {
  Report_Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Report_Of: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Reported_By: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Reported_By_Id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  Report_Text: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field:"created_at",
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field:"updated_at",
  },
  Report_Of_Id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  Report_Sub: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Report_Status: {
    type: DataTypes.STRING,
    defaultValue: "Pending",
    allowNull:true,
  },
  
},{
  timestamps:true,
  tableName:"reported"
});

export default Report;
