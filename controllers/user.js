const { UserSchema } = require("../models/associations");
const { BadRequestError, ForbiddenError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");

const User = UserSchema;

const getUser = async (req, res) => {
  if (req.user.userId !== req.params.id) {
    throw new ForbiddenError("No allow to get other user profile");
  }

  const user = await User.findByPk(req.params.id);

  if (user) {
    res.status(StatusCodes.OK).json({
      user: {
        userId: user.id,
        name: user.name,
        email: user.email
      }
    });
  } else {
    throw new NotFoundError(`No user with id ${req.params.id}`);
  }
};

const updateUser = async (req, res) => {
  const {
    body: { name, email, password },
    params: { id: userId },
    user: { userId: ownId }
  } = req;

  if (req.user.userId !== req.params.id) {
    throw new ForbiddenError("No allow to edit other user profile");
  }

  if (!name || !email || !password) {
    throw new BadRequestError("Please provide all values");
  }

  const user = await User.findByPk(userId);
  if (!user) {
    throw new NotFoundError(`No user with id ${userId}`);
  }

  const oldData = {
    email: user.email,
    name: user.name
  };

  const isPasswordSame = await bcrypt.compare(password, user.password);

  // Update user fields
  user.email = email;
  user.name = name;
  user.password = password;

  await user.save();
  const token = user.generateJWT();
  res.clearCookie("user");
  res.cookie("user", token, {
    httpOnly: true,
    secure: false, // Use secure cookies in production
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });

  res.status(StatusCodes.OK).json({
    user: {
      userId: userId,
      email: email,
      name: name,
      password: password
    },
    token: token
  });
};

const deleteUser = async (req, res) => {
  if (req.user.userId !== req.params.id) {
    throw new ForbiddenError("No allow to delete other user profile");
  }
  const user = await User.destroy({
    where: {
      id: req.params.id
    }
  });

  if (!user) {
    throw new NotFoundError(`No user with id ${req.params.id}`);
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: `Success delete user ${req.params.id}` });
};

module.exports = {
  getUser,
  updateUser,
  deleteUser
};
