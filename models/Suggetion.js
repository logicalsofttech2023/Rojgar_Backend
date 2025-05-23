import { DataTypes } from "sequelize";
import sequelize from "../connection/db.js"; // Ensure database connection

const Suggestion = sequelize.define(
  "suggestions table",
  {
    Sug_Id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Sug_Name: {
      type: DataTypes.STRING,
      allowNull: true,
      unique:true,
    },
    Suggestions: {
      type: DataTypes.JSON, 
      allowNull: true,
     
    },
    Sug_Type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "suggestions_table", 
    timestamps: false, 
  }
);

export default Suggestion;
