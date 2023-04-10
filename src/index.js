const express = require("express");
const bodyParser = require("body-parser");
const elasticClient = require("./elastic/elastic-client");
const getItemsToIndex = require("./getItems");
require("express-async-errors");

const app = express();

app.use(bodyParser.json());

// Express routes

app.post("/create-index", async (req, res) => {
  const items = getItemsToIndex();
  for (item in items) {
    await elasticClient.index({
      index: "posts",
      document: {
        ...item,
      },
    });
  }

  res.send(items);
});
app.delete("/remove-post", async (req, res) => {
  const result = await elasticClient.delete({
    index: "posts",
    id: req.query.id,
  });

  res.json(result);
});
app.get("/search", async (req, res) => {
  const result = await elasticClient.search({
    index: "posts",
    query: { fuzzy: { title: req.query.query } },
  });

  res.json(result);
});
app.get("/posts", async (req, res) => {
  const result = await elasticClient.search({
    index: "posts",
    query: { match_all: {} },
  });

  res.send(result);
});

app.listen(9000);
