const launch = require("../launch");

describe("intents/launch", () => {
  it("should return an object", () => {
    expect(launch()).toEqual({
      outputSpeech: {
        type: "PlainText",
        text: "Welcome to The Times World Cup briefing"
      },
      shouldEndSession: true
    });
  });
});
