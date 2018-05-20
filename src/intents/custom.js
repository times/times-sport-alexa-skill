const {
  getLatestBriefing,
  getLatestPodcast
} = require("../helpers/get-audio-data");

module.exports = async (intent, context) => {
  const { AudioPlayer = null } = context;
  const { name } = intent;

  const latestBriefing = await getLatestBriefing();
  const latestPodcast = await getLatestPodcast();

  switch (name) {
    case "StartPodcast":
      return {
        directives: [
          {
            type: "AudioPlayer.Play",
            playBehavior: "REPLACE_ALL",
            audioItem: {
              stream: {
                token: latestPodcast.enclosure.url,
                url: latestPodcast.enclosure.url,
                offsetInMilliseconds: 0
              }
            }
          }
        ],
        shouldEndSession: true
      };
    case "StartBriefing":
      return {
        directives: [
          {
            type: "AudioPlayer.Play",
            playBehavior: "REPLACE_ALL",
            audioItem: {
              stream: {
                token: latestBriefing.enclosure.url,
                url: latestBriefing.enclosure.url,
                offsetInMilliseconds: 0
              }
            }
          }
        ],
        shouldEndSession: true
      };
    case "AMAZON.ResumeIntent":
      return {
        directives: [
          {
            type: "AudioPlayer.Play",
            playBehavior: "REPLACE_ALL",
            audioItem: {
              stream: {
                token: AudioPlayer.token,
                url: AudioPlayer.token,
                offsetInMilliseconds: AudioPlayer.offsetInMilliseconds
              }
            }
          }
        ],
        shouldEndSession: true
      };
      return;
    case "AMAZON.CancelIntent":
    case "AMAZON.StopIntent":
    case "AMAZON.PauseIntent":
      return {
        directives: [
          {
            type: "AudioPlayer.Stop"
          }
        ],
        shouldEndSession: true
      };
    case "AMAZON.HelpIntent":
      return {
        outputSpeech: {
          type: "PlainText",
          text: "Help text goes here, with a prompting follow up question..?"
        },
        shouldEndSession: false
      };
    default:
      return {
        outputSpeech: {
          type: "PlainText",
          text:
            "I'm sorry, I didn't understand what you said. Would you like to hear the update?"
        },
        shouldEndSession: false
      };
  }
};
