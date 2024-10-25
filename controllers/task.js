const { StatusCodes } = require("http-status-codes");
const { TaskSchema } = require("../models/associations");
const { BadRequestError, NotFoundError } = require("../errors");

const Task = TaskSchema;

const addTask = async (req, res) => {
  const { title, message } = req.body;

  const task = await Task.create({
    userId: req.user.userId,
    title: title,
    message: message
  });

  if (task) {
    res.status(StatusCodes.CREATED).json({
      task: {
        taskId: task.id,
        userId: task.userId,
        title: task.title,
        message: task.message,
        done: task.done
      }
    });
  } else {
    throw new BadRequestError("Unable to create new task. Try again later.");
  }
};

const getAllTasks = async (req, res) => {
  const tasks = await Task.findAll({
    where: { userId: req.user.userId }
  });

  res.status(StatusCodes.OK).json({ tasks, count: tasks.length });
};

const getTask = async (req, res) => {
  const task = await Task.findByPk(req.params.id);

  if (task) {
    res.status(StatusCodes.OK).json({
      task: {
        taskId: task.id,
        userId: task.userId,
        title: task.title,
        message: task.message,
        done: task.done,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      }
    });
  } else {
    throw new NotFoundError(`No task with id ${req.params.id}`);
  }
};

const updateTask = async (req, res) => {
  const {
    body: { title, message, done },
    params: { id: taskId }
  } = req;

  if (!title || !message || !done) {
    throw new BadRequestError("Please provide all values");
  }

  const task = await Task.findByPk(taskId);

  if (!task) {
    throw new NotFoundError(`No task with id ${taskId}`);
  }

  task.title = title;
  task.message = message;
  task.done = done;

  const response = await task.save();

  if (response) {
    res.status(StatusCodes.OK).json({
      task: {
        taskId: task.id,
        title: task.title,
        message: task.message,
        done: task.done
      }
    });
  } else {
    throw new BadRequestError("Unable to update this task. Try again later.");
  }
};

const deleteTask = async (req, res) => {
  const taskId = req.params.id;

  const task = await Task.destroy({
    where: { id: taskId }
  });

  if (!task) {
    throw new NotFoundError(`No task with id ${taskId}`);
  } else {
    res.status(StatusCodes.OK).json({ msg: `Success delete task ${taskId}` });
  }
};

module.exports = {
  addTask,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask
};
