const loadLatestFeedItem = require("./load-latest-feed-item");

module.exports.getLatestPodcast = () =>
  loadLatestFeedItem("https://rss.acast.com/timesthegame");

module.exports.getLatestBriefing = () =>
  loadLatestFeedItem("https://rss.acast.com/timesthegame");
