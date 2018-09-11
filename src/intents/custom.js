const ua = require("universal-analytics");

const {
  getLatestBriefing,
  getLatestPodcast
} = require("../helpers/get-audio-data");
const { ga } = require("../config");

const sendEventFactory = ga => tracking =>
  new Promise(resolve => ga.event(tracking, () => resolve()));

module.exports = async (intent, context = {}) => {
  const visitor = ua(
    ga.trackingId,
    context.System && context.System.user && context.System.user.userId
  );

  const sendEvent = sendEventFactory(visitor);

  const { AudioPlayer = null } = context;
  const { name } = intent;

  const latestBriefing = await getLatestBriefing();
  const latestPodcast = await getLatestPodcast();

  switch (name) {
    case "StartPodcast":
      await sendEvent({
        ec: "Intent",
        ea: "StartPodcast"
      });

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
    case "AMAZON.YesIntent":
      if (name === "DeeplinkStartBriefing") {
        console.log("Briefing started from deeplink"); // eslint-disable-line no-console
      }

      await sendEvent({
        ec: "Intent",
        ea: name
      });

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
                title: "Times Sport Premier League Briefing",
                subtitle: "Natalie Sawyer previews the weekend’s matches",
                art: {
                  contentDescription:
                    "The Times Sport Premier League briefing logo",
                  sources: [
                    {
                      url:
                        "https://nuk-tnl-editorial-prod-staticassets.s3.amazonaws.com/public/2018/times-sport-alexa-skill/assets/alexa-show-image-960x640.png",
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
      await sendEvent({
        ec: "Intent",
        ea: name,
        el: AudioPlayer.token,
        ev: AudioPlayer.offsetInMilliseconds
      });

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
    case "AMAZON.NoIntent":
      await sendEvent({
        ec: "Intent",
        ea: name
      });

      return {
        directives: [
          {
            type: "AudioPlayer.Stop"
          }
        ],
        shouldEndSession: true
      };
    case "AMAZON.PauseIntent":
      await sendEvent({
        ec: "Intent",
        ea: name
      });

      return {
        directives: [
          {
            type: "AudioPlayer.Stop"
          }
        ],
        shouldEndSession: true
      };
    case "AMAZON.HelpIntent":
      await sendEvent({
        ec: "Intent",
        ea: name
      });

      return {
        outputSpeech: {
          type: "PlainText",
          text:
            "Natalie Sawyer delivers the key news, stats and analysis in the build-up to the Premier League weekend. In this bitesize briefing, Natalie will bring you the thoughts of our award-winning writers including Henry Winter, Oliver Kay, Matt Dickinson and Alyson Rudd on the big games and deliver her own Premier League predictions. Just say: “Alexa, launch Times Sport”. Would you like to hear the latest briefing now?"
        },
        shouldEndSession: false
      };
    case "AudioPlayer.PlaybackNearlyFinished":
      return {
        directives: [
          {
            type: "AudioPlayer.ClearQueue",
            clearBehavior: "CLEAR_ENQUEUED"
          }
        ]
      };
    case "AudioPlayer.PlaybackStopped":
      return {
        directives: [
          {
            type: "AudioPlayer.ClearQueue",
            clearBehavior: "CLEAR_ENQUEUED"
          }
        ]
      };
    default:
      return {
        outputSpeech: {
          type: "PlainText",
          text:
            "I'm sorry, I didn't understand what you said. Would you like to hear the latest briefing from Natalie Sawyer?"
        },
        shouldEndSession: false
      };
  }
};
