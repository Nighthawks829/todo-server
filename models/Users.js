const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../db/connect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { toDefaultValue } = require("sequelize/lib/utils");
require("dotenv").config();

const UserSchema = sequelize.define(
  "Users",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 50],
          msg: "User name should be between 2 and 50 characters"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: "Please provide a valid email"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 100],
          msg: "Password length should be between 2 and 100 characters"
        }
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    timestamps: false,
    freezeTableName: true,
    hooks: {
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
      beforeUpdate: async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        user.updatedAt = new Date();
      }
    }
  }
);

UserSchema.prototype.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.prototype.generateJWT = function () {
  return jwt.sign(
    { userId: this.id, name: this.name, email: this.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME
    }
  );
};

sequelize
  .sync()
  .then(() => {
    console.log("Users table created successfully");
  })
  .catch((error) => {
    console.log("Unable to create Users table: ", error);
  });

module.exports = UserSchema;

