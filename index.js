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
      res.status(200).json({
        data: data,
        messages: "Success",
      });
    });
  });
  ////
  app.get("/myPost", (req, res) => {
    //console.log(req.query.loginUserEmail);
    //{ loginUserEmail: req.query.loginUserEmail }
    postCollection
      .find({ loginUserEmail: req.query.loginUserEmail })
      .toArray((err, items) => {
        res.send(items);
      });
  });
  // creating post close//
  // all post
  app.get("/allPost", (req, res) => {
    postCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });
  //=====delete===//
  app.delete("/delete/:id", (req, res) => {
    // console.log(req.params.id);
    postCollection
      .deleteOne({ _id: ObjectID(req.params.id) })
      .then((result) => {
        //  console.log(result);
        //res.send(result.insertedCount > 0);
        res.status(200).json({
          data: req.params.id,
          messages: "Success",
        });
      });
    // console.log(req.params.id);
  });
  ////
  // app.delete("/deletes/:id", (req, res) => {
  //   console.log(req.params.id);
  //   postCollection
  //     .deleteOne({ Comment: ObjectID(req.params.id) })
  //     .then((result) => {
  //       //  console.log(result);
  //       res.send(result.insertedCount > 0);
  //     });
  //   // console.log(req.params.id);
  // });
  //=====update===//
  app.get("/postes/:id", (req, res) => {
    postCollection
      .find({ _id: ObjectID(req.params.id) })
      .toArray((err, document) => {
        res.send(document[0]);
        //  console.log(document);
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
      .then((data) => {
        // console.log(result);
        res.status(200).json({
          data: data,
          messages: "Success",
        });
      });
  });
  //====comment part open====//
  // app.patch("/comments/:id", (req, res) => {
  //   postCollection
  //     .updateOne(
  //       { id: ObjectID(req.params.id) },
  //       {
  //         $set: {
  //           comments: req.body.comments,
  //         },
  //       }
  //     )
  //     .then((result) => {
  //       console.log(result);
  //     });
  // });

  app.patch("/comments/:id", (req, res) => {
    // console.log(req.body.id);
    // console.log(req.body.comments);
    postCollection
      .updateOne(
        { _id: ObjectID(req.params.id) },
        {
          $push: {
            Comment: req.body.comments,
            // id: req.body.id,
          },
        }
      )
      .then((data) => {
        // console.log(result);
        res.status(200).json({
          data: data,
          messages: "Success",
        });
      });
  });
  //====== comment part close ======//

  // ====== Like part open =======//

  app.patch("/like/:id", (req, res) => {
    console.log(req.body.id);
    console.log(req.body.like);
    // postCollection
    //   .updateOne(
    //     { _id: ObjectID(req.params.id) },
    //     {
    //       $push: {
    //         Comment: req.body.comments,
    //         // id: req.body.id,
    //       },
    //     }
    //   )
    //   .then((data) => {
    //     // console.log(result);
    //     res.status(200).json({
    //       data: data,
    //       messages: "Success",
    //     });
    //   });
  });
  // ====== Like part open close =======//

  //comment
  // app.put("/comments/:id", (req, res) => {
  //   postCollection
  //     .findByIdAndUpdate(
  //       { id: ObjectID(req.params.id) },
  //       {
  //         $push: { comments: req.body.comments },
  //       }
  //     )
  //     .populate("comments.postedBy", "_id name")
  //     .populate("postedBy", "_id name")
  //     .exec((err, result) => {
  //       if (err) {
  //         return res.status(422).json({ error: err });
  //       } else {
  //         res.json(result);
  //       }
  //     });
  // });
  //
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT || port);
