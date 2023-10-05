const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new Error("user not found");
  res.status(200).json({
    status: "success",
    user,
  });
});

exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});
