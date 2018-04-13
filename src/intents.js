const launch = () => ({
  outputSpeech: {
    type: "PlainText",
    text: "Welcome to The Times World Cup briefing"
  },
  shouldEndSession: true
});

const custom = ({ name }) => {
  switch (name) {
    case "StartBriefing":
      return launch();
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

module.exports = {
  launch,
  custom
};
