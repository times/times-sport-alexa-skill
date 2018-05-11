const getBriefingUrl = require("../helpers/get-briefing-url");

module.exports = ({ name }) => {
  switch (name) {
    case "StartBriefing":
    case "AMAZON.ResumeIntent":
      return {
        directives: [
          {
            type: "AudioPlayer.Play",
            playBehavior: "REPLACE_ALL",
            audioItem: {
              stream: {
                token: "the-times-world-cup-briefing",
                url: getBriefingUrl(),
                offsetInMilliseconds: 0
              }
            }
          }
        ],
        shouldEndSession: true
      };
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
