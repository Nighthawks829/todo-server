const express = require("express");
const router = express.Router();
const {
  addTask,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask
} = require("../controllers/task");

const authenticateUser = require("../middleware/authenticationUser");

router
  .route("/")
  .post(authenticateUser, addTask)
  .get(authenticateUser, getAllTasks);

router
  .route("/:id")
  .get(authenticateUser, getTask)
  .patch(authenticateUser, updateTask)
  .delete(authenticateUser, deleteTask);

module.exports = router;
