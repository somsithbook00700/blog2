const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const handleEvent = async (type, data) => {
  if (type === "CreateComment") {
    const { id, content, postId } = data;
    if (data.status === "pending") {
      const status = content.includes("orange") ? "reject" : "approach";
      await axios.post("http://localhost:4005/events", {
        type: "CommentModerated",
        data: {
          id,
          postId,
          content,
          status: status,
        },
      });
      console.log("sending status", status, "to", content);
    }
  }
};

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);
  res.send({});
});

app.listen(4003, async () => {
  console.log("Moderation service listening on port 4003");

  const res = await axios.get("http://localhost:4005/events");

  for (let comment of res.data) {
    handleEvent(comment.type, comment.data);
  }
});
