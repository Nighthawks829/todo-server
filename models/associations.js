const UserSchema = require("./Users");
const TaskSchema = require("./Tasks");

UserSchema.hasMany(TaskSchema, { foreignKey: "userId", as: "tasks" });
TaskSchema.belongsTo(UserSchema, { foreignKey: "userId", as: "user" });

module.exports = {
  UserSchema,
  TaskSchema
};
