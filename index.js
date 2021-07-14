const express = require("express");
const app = express();
const port = 1000;
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.json());
app.use(cors());
require("dotenv").config();
console.log(process.env.DB_USER);
const ObjectID = require("mongodb").ObjectID;
const { MongoClient } = require("mongodb");
const uri = ` mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yaeov.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const postCollection = client.db("memories").collection("post");

  //==== creating post====///
  app.post("/addPost", (req, res) => {
    const posts = req.body;
    postCollection.insertOne(posts).then((result) => {
      res.send(result.insertedCount > 0);
      //  console.log(result);
    });
  });
  ////
  app.get("/allPost", (req, res) => {
    postCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });
  // creating post close//

  //=====delete===//
  app.delete("/delete/:id", (req, res) => {
    console.log(req.params.id);
    postCollection
      .deleteOne({ _id: ObjectID(req.params.id) })
      .then((result) => {
        console.log(result);
        res.send(result.insertedCount > 0);
      });
    console.log(req.params.id);
  });
  ////
  //=====update===//
  app.get("/postes/:id", (req, res) => {
    postCollection
      .find({ _id: ObjectID(req.params.id) })
      .toArray((err, document) => {
        res.send(document[0]);
        console.log(document);
      });
    //  console.log(req.params.id);
  });
  //====//
  app.patch("/update/:id", (req, res) => {
    postCollection
      .updateOne(
        { _id: ObjectID(req.params.id) },
        {
          $set: {
            creator: req.body.creator,
            title: req.body.title,
            message: req.body.message,
            tags: req.body.tags,
          },
        }
      )
      .then((result) => {
        console.log(result);
      });
  });
  //====comments====//
  app.patch("/comments/:id", (req, res) => {
    postCollection
      .updateOne(
        { id: ObjectID(req.params.id) },
        {
          $set: {
            comments: req.body.comments,
          },
        }
      )
      .then((result) => {
        console.log(result);
      });
  });
  ///
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port);
