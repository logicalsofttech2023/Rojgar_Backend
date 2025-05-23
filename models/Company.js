// Company user name , mobile number email is unique 
import sequelize from "../connection/db.js";
import { DataTypes } from "sequelize";
import bcrypt from "bcryptjs";




const Company = sequelize.define('company_table', {





    Company_Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    Company_User_Name: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true, //
    },
    Company_Name: {
        type: DataTypes.STRING(255),
        allowNull: true, //
    },
    Company_Type: {
        type: DataTypes.STRING(100),
        allowNull: true, //
    },
    Country_Code: {
        type: DataTypes.STRING(20),
        allowNull: true,//
    },
    Mobile_Number: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true,
    },
    Company_Email: {
        type: DataTypes.STRING(255),
        allowNull: true,//
        unique: true,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,

    },
    Company_Logo: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    Company_Website: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    Company_Description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    Company_Status: {
        type: DataTypes.ENUM("Active", "Inactive", "Pending"),
        allowNull: false,
        defaultValue: "Inactive",
    },
    Company_Start_Date: {
        type: DataTypes.DATE,
        allowNull: true,//
    },
    Company_Address: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    Latitude: {
        type: DataTypes.DECIMAL(10, 6),
        allowNull: true,
    },
    Longitude: {
        type: DataTypes.DECIMAL(10, 6),
        allowNull: true,
    },
    Company_Gov_Docs: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
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
    DEVICE_ID: {
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
    reset_token: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    reset_token_expires: {
        type: DataTypes.DATE,
        allowNull: true, 
    },
},
    {
        tableName: "company_table",
        timestamps: true, // Enables createdAt and updatedAt
    }
);
Company.beforeSave(async (company, options) => {
    if (company.changed("password") && company.password) {
        company.password = await bcrypt.hash(company.password, 10);
    }
});

// $2b$10$vw6SXM.0DwaI/3KWa7Ggf.yootUgQwqm2Tcph8d.Yztrktz6sGY9y
// $2b$10$vw6SXM.0DwaI/3KWa7Ggf.yootUgQwqm2Tcph8d.Yztrktz6sGY9y
// $2b$10$vw6SXM.0DwaI/3KWa7Ggf.yootUgQwqm2Tcph8d.Yztrktz6sGY9y
export default Company;