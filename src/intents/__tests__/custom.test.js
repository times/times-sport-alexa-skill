jest.mock("../launch", () => jest.fn());
const custom = require("../custom");
const launch = require("../launch");

describe("intents/custom", () => {
  it("should call launch if StartBriefing is passed", () => {
    launch.mockImplementation(() => "Foo");

    expect(custom({ name: "StartBriefing" })).toEqual("Foo");
  });

  it("should return an object when an unknown intent name is passed", () => {
    expect(custom({ name: "SomeUnknownIntent" })).toEqual({
      outputSpeech: {
        type: "PlainText",
        text:
          "I'm sorry, I didn't understand what you said. Would you like to hear the update?"
      },
      shouldEndSession: false
    });
  });
});
