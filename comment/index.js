const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const axios = require("axios");

        const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentByPostId = [];
app.get("/posts/:id/comments", (req, res) => {
  res.send(commentByPostId[req.params.id]);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comment = commentByPostId[req.params.id] || [];
  comment.push({
    id: commentId,
    content,
    status: "pending",
  });
  commentByPostId[req.params.id] = comment;

  await axios.post("http://localhost:4005/events", {
    type: "CreateComment",
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: "pending",
    },
  });

  res.status(201).send(commentByPostId[req.params.id]);
});

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  if (type === "CommentModerated") {
    console.log("Retrived:", req.body.type);
    const { id, postId, content, status } = data;
    const comments = commentByPostId[postId];

    const comment = comments.find((comment) => {
      return comment.id === id;
    });
    comment.content = content;
    comment.status = status;
    await axios.post("http://localhost:4005/events", {
      type: "CommentUpdated",
      data: {
        id,
        postId,
        content,
        status,
      },
    });
    console.log("sended: CommentUpdated");
  }
  res.send({});
});

app.listen(4001, () => {
  console.log("Comment-service Listening on port 4001");
});
