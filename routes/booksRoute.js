const express = require("express");
const booksController = require("./../controllers/booksController");
const authContoller = require("./../controllers/authController");

const router = express.Router();
router
  .route("/")
  .get(
    authContoller.protect,
    authContoller.restrictToAdmin,
    booksController.getBooks
  )
  .post(booksController.addBook);

router
  .route("/:id")
  .get(booksController.getBook)
  .patch(booksController.editBook)
  .delete(booksController.deleteBook);

module.exports = router;
