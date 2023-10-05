const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true; // only https
  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;
  user.passwordConfirmation = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirmation: req.body.passwordConfirmation,
    role: req.body.role,
  });

  createSendToken(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError(401, "Wrong email or password"));

  const user = await User.findOne({ email }).select("+password");

  if (!(await user?.comparePasswords(req.body.password, user.password)))
    return next(new AppError(401, "Wrong email or password"));

  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token = req.cookies.jwt;

  if (!token) return next(new AppError(401, "Please login..."));

  const data = jwt.verify(token, process.env.SECRET);
  const { id } = data;

  const user = await User.findById(id);
  if (!user) {
    return next(
      new AppError(401, "The user with this token no longer exists...")
    );
  }

  req.user = user;
  next();
});

exports.restrictToAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return next(new AppError(403, "You don't have access to see this page"));

  next();
};
