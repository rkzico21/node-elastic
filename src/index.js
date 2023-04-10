const express = require("express");
const bodyParser = require("body-parser");
const elasticClient = require("./elastic/elastic-client");
const client = elasticClient;
const getItemsToIndex = require("./getItems");
const getQueryPayload = require("./getQueryPayload");
require("express-async-errors");

const app = express();

app.use(bodyParser.json());

// Express routes
const indexName = "items";
app.post("/index-items", async (req, res) => {
  // here we are forcing an index refresh, otherwise we will not
  // get any result in the consequent search
  const items = getItemsToIndex();
  for (let i = 0; i < items.length; i++) {
    await client.index({
      index: indexName,
      _id: items.id,
      document: {
        ...items[i],
      },
    });
  }

  await client.indices.refresh({ index: indexName });

  res.send(items);
});
app.delete("/remove-post", async (req, res) => {
  const result = await elasticClient.deleteI({
    index: indexName,
    id: req.query.id,
  });

  res.json(result);
});

app.get("/search", async (req, res) => {
  const payload = getQueryPayload({
    categories: [
      { name: "category1", subCategories: ["default", "subcategory1"] },
      { name: "category2" },
      { name: "category4", subCategories: ["default"] },
    ],
    title: ["item0", "item9", "item8", "item7", "item6", "item5"],
  });

  const result = await elasticClient.search({
    index: indexName,
    body: payload,
  });
  res.json(result);
});
app.get("/posts", async (req, res) => {
  const result = await elasticClient.search({
    index: indexName,
    query: {
      match_all: {},
    },
  });

  res.json(result);
  console.log(result.hits.hits);
});

app.listen(9000);
