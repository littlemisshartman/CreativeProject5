const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();
const auth = require("./auth.js");
const users = require("./users.js");
const User = users.model;
const photos = require("./photos.js");
const Photo = photos.model;

const commentSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    photo: {
        type: mongoose.Schema.ObjectId,
        ref: 'Photo'
    },
    text: String,
    created: {
      type: Date,
      default: Date.now
    },
  });
  
  const Comment = mongoose.model('Comment', commentSchema);

  // upload comment
router.post("/", auth.verifyToken, User.verify, async (req, res) => {
    if (!req.user) {
        return res.status(400).send({
            message: "Must be logged in"
        });
    }
    else if (!req.body.photo) {
        return res.status(400).send({
            message: "Must have a photo"
        })
    }
    // check parameters
    console.log(req.user);
    const comment = new Comment({
      user: req.user,
      photo: req.body.photo,
      text: req.body.text,
    });
    try {
        console.log(comment)
      await comment.save();
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  });

  // get my comments
router.get("/:id", auth.verifyToken, User.verify, async (req, res) => {
    // return comments
    try {
      let comments = await Comment.find({
        photo: req.params.id
      }).sort({
        created: -1
      }).populate('user');
      return res.send(comments);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  });

  // get all comments
router.get("/all", async (req, res) => {
  try {
    let comments = await Comment.find().sort({
      created: -1
    }).populate('user');
    return res.send(comments);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// // get single comment
// router.get("/:id", auth.verifyToken, User.verify, async (req, res) => {
//   try {
//     let comment = await Comment.find({
//       _id: req.id
//     })
//     return res.send(comment);
//   } catch (error) {
//     console.log(error);
//     return res.sendStatus(500);
//   }
// });

  module.exports = {
    model: Comment,
    routes: router,
  }