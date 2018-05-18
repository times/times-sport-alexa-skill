const Parser = require("rss-parser");

module.exports = async url => {
  const parser = new Parser();

  const { items } = await parser.parseURL(url);

  if (items.length === 0) return null;

  return items[0];
};
