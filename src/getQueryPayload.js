const getCategoriesFilter = (categories) => {
  const categoriesShould = [];
  const defaultCategories = categories
    .filter(
      (c) => !c.subCategories?.length || c.subCategories.includes("default")
    )
    .map((c) => c.name);

  if (defaultCategories.length) {
    const defaultCategoriesTerms = {
      terms: { categoryName: defaultCategories },
    };

    categoriesShould.push({
      bool: {
        must: [defaultCategoriesTerms],
        must_not: { exists: { field: "categorySubtype" } },
      },
    });
  }

  categories.forEach((c) => {
    const { name, subCategories } = c;
    const subCategoriesWithoutDefault = (subCategories || []).filter(
      (s) => !s.includes("default")
    );

    console.log(subCategoriesWithoutDefault);
    if (!subCategoriesWithoutDefault.length) return;
    const subcategory_must = [];

    const categoryTerm = {
      terms: { categoryName: [name] },
    };
    const subCategoryTerm = {
      terms: { categorySubtype: subCategoriesWithoutDefault },
    };

    subcategory_must.push(categoryTerm);
    subcategory_must.push(subCategoryTerm);
    console.log("sub categories must", subcategory_must);
    categoriesShould.push({
      bool: {
        must: subcategory_must,
      },
    });
  });

  return categoriesShould;
};

const getQueryPayload = (filter) => {
  const _should = [];
  const must = [];
  const or_must = [];
  const must_not = [];
  const or_must_not = [];
  const sort = [];

  const { mTypes, searchString, categories, title } = filter;

  let query = {
    simple_query_string: {
      query: searchString,
      default_operator: "and",
    },
  };

  if (searchString) must.push(query);
  if (searchString) or_must.push(query);

  const mTypesTerms = { terms: { mType: [] } };
  const mTypesTerms_1 = { terms: { mType: [] } };

  if (title) {
    const titleTerms = { terms: { title } };
    must.push(titleTerms);
    or_must.push(titleTerms);
  }

  // must.push(mTypesTerms);
  // or_must.push(mTypesTerms_1);

  const opt1 = {
    bool: {
      must,
      must_not,
    },
  };
  const opt2 = {
    bool: {
      must: or_must,
      must_not: or_must_not,
    },
  };

  const categoriesShould = getCategoriesFilter(categories);
  if (categoriesShould?.length > 0) {
    const categoriesOpt = {
      bool: {
        should: categoriesShould,
      },
    };
    must.push(categoriesOpt);
    or_must.push(categoriesOpt);
  }

  _should.push(opt1);
  _should.push(opt2);

  const body = {
    from: 0,
    size: 1000,
    query: {
      bool: { should: _should },
    },
    sort,
  };

  console.log(JSON.stringify(body, null, 2));

  return body;
};

module.exports = getQueryPayload;
