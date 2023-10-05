const mongodb = require("mongodb");
const fs = require("fs");

const books = JSON.parse(
  fs.readFileSync(`${__dirname}/db.json`, {
    encoding: "utf-8",
  })
);

// practice after files!

const MongoClient = mongodb.MongoClient;
const connectionUrl = "mongodb://127.0.0.1:27017";
const dbName = "book-shop";

MongoClient.connect(connectionUrl, { useNewUrlParser: true })
  .then((client) => {
    console.log("Connected successfully to bookshop database");
    const db = client.db(dbName);
    const promises = books.map((book) => {
      return db.collection("books").insertOne(book);
    });
    Promise.all(promises).then(() => process.exit(1));
  })
  .catch((e) => {
    console.log(e.message);
    process.exit(1);
  });
