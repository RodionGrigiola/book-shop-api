const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "book name can't be empty"],
  },
  author: {
    type: String,
    require: [true, "book must have an author"],
  },
  rating: {
    type: Number,
    min: [1, "Rating cant be less than 1"],
    max: [5, "Rating cant be greater than 5"],
  },
  numRatings: Number,
  numReviews: Number,
  genres: {
    type: [String],
    require: [true, "book must have genres"],
  },
  pages: Number,
  published: Date,
  desription: {
    type: String,
    require: [true, "book must have description"],
  },
  image: String,
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
