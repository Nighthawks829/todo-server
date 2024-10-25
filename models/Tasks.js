const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../db/connect");

const TaskSchema = sequelize.define(
  "Tasks",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 50],
          msg: "Task titiel should be between 2 and 50 characters"
        }
      }
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    done: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
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
      beforeUpdate: async (task) => {
        task.updatedAt = new Date();
      }
    }
  }
);

sequelize
  .sync()
  .then(() => {
    console.log("Tasks table created successfully");
  })
  .catch((error) => {
    console.log("Unable to create Tasks table: ", error);
  });

module.exports = TaskSchema;
