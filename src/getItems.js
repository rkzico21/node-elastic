const { v4: uuidv4 } = require("uuid");

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
      id: `${uuidv4()}-${i}`,
      title: `item${i}`,
    };

    const category = categories[i % categories.length];
    item.categoryName = category.name;
    if (category.subType) item.categorySubtype = category.subType;

    items.push(item);
  }

  return items;
};

module.exports = getItemsToIndex;
