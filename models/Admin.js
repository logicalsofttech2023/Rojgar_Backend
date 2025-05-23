import { DataTypes } from "sequelize";
import sequelize from "../connection/db.js"; // Import your Sequelize instance
import bcrypt from "bcryptjs";
const Admin = sequelize.define(
  
  
  
  
  
    "admin",
  {
    Admin_Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Admin_Name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  
    Admin_Password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "admin",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// 🔐 Hash password before saving
Admin.beforeCreate(async (admin) => {
  const salt = await bcrypt.genSalt(10);
  admin.Admin_Password = await bcrypt.hash(admin.Admin_Password, salt);
});

// 🔐 Hash password before updating if changed
Admin.beforeUpdate(async (admin) => {
  if (admin.changed("Admin_Password")) {
    const salt = await bcrypt.genSalt(10);
    admin.Admin_Password = await bcrypt.hash(admin.Admin_Password, salt);
  }
});






















































export default Admin;
