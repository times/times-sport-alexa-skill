const custom = require("../custom");

describe("intents/custom", () => {
  it("should start the AudioPlayer if StartBriefing is passed", async () => {
    const response = await custom({ name: "StartBriefing" });
    expect(response.directives[0].type).toEqual("AudioPlayer.Play");
    expect(response.shouldEndSession).toEqual(true);
  });

  it("should start the AudioPlayer if AMAZON.ResumeIntent is passed", async () => {
    const response = await custom({ name: "AMAZON.ResumeIntent" });
    expect(response.directives[0].type).toEqual("AudioPlayer.Play");
    expect(response.shouldEndSession).toEqual(true);
  });

  it("should stop the AudioPlayer if AMAZON.CancelIntent is passed", async () => {
    const response = await custom({ name: "AMAZON.CancelIntent" });
    expect(response.directives[0].type).toEqual("AudioPlayer.Stop");
    expect(response.shouldEndSession).toEqual(true);
  });

  it("should stop the AudioPlayer if AMAZON.StopIntent is passed", async () => {
    const response = await custom({ name: "AMAZON.StopIntent" });
    expect(response.directives[0].type).toEqual("AudioPlayer.Stop");
    expect(response.shouldEndSession).toEqual(true);
  });

  it("should stop the AudioPlayer if AMAZON.PauseIntent is passed", async () => {
    const response = await custom({ name: "AMAZON.PauseIntent" });
    expect(response.directives[0].type).toEqual("AudioPlayer.Stop");
    expect(response.shouldEndSession).toEqual(true);
  });

  it("should stop the AudioPlayer if AMAZON.HelpIntent is passed", async () => {
    const response = await custom({ name: "AMAZON.HelpIntent" });
    expect(response).toEqual({
      outputSpeech: {
        type: "PlainText",
        text: "Help text goes here, with a prompting follow up question..?"
      },
      shouldEndSession: false
    });
  });

  it("should return an object when an unknown intent name is passed", async () => {
    const response = await custom({ name: "SomeUnknownIntent" });

    expect(response).toEqual({
      outputSpeech: {
        type: "PlainText",
        text:
          "I'm sorry, I didn't understand what you said. Would you like to hear the update?"
      },
      shouldEndSession: false
    });
  });
});
