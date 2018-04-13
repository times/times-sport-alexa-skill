module.exports = ({ name }) => {
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
