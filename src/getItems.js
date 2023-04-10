const uuid = require("uuid/v4");

const categories = [
  {
    name: "category1",
  },
  {
    name: "category2",
  },
  {
    name: "category3",
  },
  {
    name: "category4",
  },
  {
    name: "category4",
    subType: "subcategory1",
  },
  {
    name: "category4",
    subType: "subcategory2",
  },
];

const getItemsToIndex = () => {
  const items = [];
  for (let i = 0; i < categories.length * 2; i++) {
    const item = {
      id: `${uuid()}-${i}`,
      title: `item${i}`,
    };

    const category = i % categories.length;
    item.categoryName = category.name;
    if (category.subType) item.categorySubtype = category.subType;

    items.push(item);
  }

  return items;
};

module.exports = getItemsToIndex;
