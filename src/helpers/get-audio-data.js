const loadLatestFeedItem = require("./load-latest-feed-item");

module.exports.getLatestPodcast = () =>
  loadLatestFeedItem("https://rss.acast.com/timesthegame");

module.exports.getLatestBriefing = () => ({
  enclosure: {
    url:
      "https://nuk-tnl-editorial-prod-staticassets.s3.amazonaws.com/public/2018/world-cup-alexa-breifing/assets/sample-briefing.mp3"
  }
});

// module.exports.getLatestPodcast().then(a => console.log({ a }));
