const express = require("express");
const bodyParser = require("body-parser");
const elasticClient = require("./elastic/elastic-client");
const client = elasticClient;
const getItemsToIndex = require("./getItems");
require("express-async-errors");

const app = express();

app.use(bodyParser.json());

// Express routes

app.post("/create-index", async (req, res) => {
  // here we are forcing an index refresh, otherwise we will not
  // get any result in the consequent search
  const items = getItemsToIndex();
  /*for (let i = 0; i < items.length; i++) {
    await client.index({
      index: "test-index",
      id: items.id,
      document: {
        ...items[i],
      },
    });
  }*/

  await client.indices.refresh({ index: "test-index" });

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
    index: "test-index",
    query: { fuzzy: { title: req.query.query } },
  });
  res.json(result);
});
app.get("/posts", async (req, res) => {
  const result = await elasticClient.search({
    index: "test-index",
    query: {
      match_all: {},
    },
  });

  res.json(result);
  console.log(result.hits.hits);
});

app.listen(9000);
