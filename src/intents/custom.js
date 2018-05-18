const { getLatestBriefing } = require("../helpers/get-audio-data");

module.exports = async (intent, event) => {
  const { name } = intent;

  switch (name) {
    case "StartPodcast":
      const latestPodcast = await getLatestPodcast();

      return {
        outputSpeech: {
          type: "PlainText",
          text:
            "PODCAST - Help text goes here, with a prompting follow up question..?"
        },
        // directives: [
        //   {
        //     type: "AudioPlayer.Play",
        //     playBehavior: "REPLACE_ALL",
        //     audioItem: {
        //       stream: {
        //         token: latestPodcast.enclosure.url,
        //         url: latestPodcast.enclosure.url,
        //         offsetInMilliseconds: 0
        //       }
        //     }
        //   }
        // ],
        shouldEndSession: true
      };
    case "StartBriefing":
      const latestBriefing = await getLatestBriefing();
      return {
        outputSpeech: {
          type: "PlainText",
          text:
            "BRIEFING - Help text goes here, with a prompting follow up question..?"
        },
        directives: [
          {
            type: "AudioPlayer.Play",
            playBehavior: "REPLACE_ALL",
            audioItem: {
              stream: {
                token: "abc",
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
                token: "the-times-world-cup-briefing",
                url: latestBriefing.url,
                offsetInMilliseconds: 0
              }
            }
          }
        ]
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
