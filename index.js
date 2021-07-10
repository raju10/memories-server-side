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
  const userCollection = client.db("memories").collection("userInfo");
  app.post("/addPost", (req, res) => {
    const posts = req.body;
    // console.log(posts);
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
  ////

  app.put("/addPosts", (req, res) => {
    const posts = req.body.clientInfo;
    // const comment = {
    //   text: req.body.data.comment,
    //   id: req.body._id,
    // };
    console.log(posts);
    postCollection.find(posts).toArray((err, items) => {
      res.send(items);
      console.log(items);
    });
  });
  ////////////Comment's.......
  // app.post("/userInfo", (req, res) => {
  //   const posts = req.body;
  //   console.log(posts);
  //   userCollection.insertOne(posts).then((result) => {
  //     res.send(result.insertedCount > 0);
  //     console.log(result);
  //   });
  // });
  // ////
  // app.get("/allUserInfo", (req, res) => {
  //   userCollection.find().toArray((err, items) => {
  //     res.send(items);
  //   });
  // });
  ////
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
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port);