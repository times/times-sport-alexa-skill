const {
  getLatestBriefing,
  getLatestPodcast
} = require("../helpers/get-audio-data");

module.exports = async (intent, context = {}) => {
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
              },
              metadata: {
                title: latestPodcast.title,
                subtitle: latestPodcast.itunes.subtitle,
                art: {
                  contentDescription: latestPodcast.title,
                  sources: [
                    {
                      url: latestPodcast.itunes.image,
                      size: "LARGE",
                      widthPixels: "1500",
                      heightPixels: "1500"
                    }
                  ]
                }
              }
            }
          }
        ],
        shouldEndSession: true
      };
    case "StartBriefing":
    case "DeeplinkStartBriefing":
      if (name === "DeeplinkStartBriefing") {
        console.log("Briefing started from deeplink"); // eslint-disable-line no-console
      }

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
              },
              metadata: {
                title: "The Times World Cup briefing",
                subtitle: "All the latest from Russia",
                art: {
                  contentDescription: "The Times World Cup briefing logo",
                  sources: [
                    {
                      url:
                        "https://nuk-tnl-editorial-prod-staticassets.s3.amazonaws.com/public/2018/world-cup-alexa-breifing/assets/alexa-show-image-960x640.png",
                      size: "MEDIUM",
                      widthPixels: "960",
                      heightPixels: "640"
                    }
                  ]
                }
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
    case "AMAZON.CancelIntent":
    case "AMAZON.StopIntent":
      return {
        directives: [
          {
            type: "AudioPlayer.Stop"
          }
        ],
        shouldEndSession: true
      };
    case "AMAZON.PauseIntent":
      return {
        directives: [
          {
            type: "AudioPlayer.Stop"
          }
        ],
        shouldEndSession: false
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
