import { DataTypes } from "sequelize";
import sequelize from "../connection/db.js"; // Import your Sequelize instance
import bcrypt from "bcryptjs";
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const User = sequelize.define("user_table", {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  Name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Gender: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  Education_Details: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  Education_level: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  Experience_Years: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  Experience_Details: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  City: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  Job_Role_Want: {
    type: DataTypes.JSON,
    allowNull: true,
  },

  Email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255), // Store hashed password
    allowNull: true,
  },
  Country_Code: {
    type: DataTypes.STRING(11),
    allowNull: true,

  },
  Mobile_Number: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  Date_of_Birth: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  Current_Location: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },

  createdAt: {
    type: DataTypes.DATE,
    field: "Created_At",

  },
  updatedAt: {
    type: DataTypes.DATE,
    field: "Updated_At", // Maps to SQL column "Updated_At"
  },


  FCM_ID: {
    type: DataTypes.STRING,
    allowNull: true,
    set(value) {
      if (value) {
        const salt = bcrypt.genSaltSync(10);
        this.setDataValue("FCM_ID", bcrypt.hashSync(value, salt));
      }
    },
  },
  Device_ID: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true, // Ensure each device ID is unique
    set(value) {
      if (value) {
        const salt = bcrypt.genSaltSync(10);
        this.setDataValue("DEVICE_ID", bcrypt.hashSync(value, salt));
      }
    },


  },
  user_image: {
    type: DataTypes.STRING(501),
    allowNull: true,
  },
  Skills: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  Certificates: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  reset_token: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  reset_token_expires: {
    type: DataTypes.DATE,
    allowNull: true,
  },

}, {
  tableName: "user_table",
  timestamps: true,
});

// 🔹 Hash password before saving to database
User.beforeSave(async (user) => {
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});
export default User;
