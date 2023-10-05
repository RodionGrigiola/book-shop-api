const AppError = require("../utils/AppError");
const Books = require("./../models/booksModel");
const catchAsync = require("./../utils/catchAsync");

exports.getBooks = catchAsync(async (req, res, next) => {
  const data = await Books.find();
  res.status(200).json({
    staus: "success",
    results: data.length,
    books: data,
  });
});

exports.getBook = catchAsync(async (req, res, next) => {
  const book = await Books.findById(req.params.id);
  if (!book) next(new AppError(404, "book with such id not found!"));
  res.status(200).json({
    status: "success",
    data: {
      book,
    },
  });
});
exports.addBook = catchAsync(async (req, res, next) => {
  const book = await Books.create(req.body);
  res.status(201).json({
    status: "success",
    msg: "book added!",
    data: {
      book,
    },
  });
});

exports.editBook = catchAsync(async (req, res, next) => {
  const book = await Books.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!book) next(new AppError(404, "book with such id not found!"));
  res.status(201).json({
    status: "success",
    msg: "book updated!",
    data: {
      book,
    },
  });
});

exports.deleteBook = catchAsync(async (req, res, next) => {
  await Books.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "successefully deleted",
  });
});
