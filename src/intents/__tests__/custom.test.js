jest.mock("../../helpers/get-audio-data", () => ({
  getLatestBriefing: () =>
    Promise.resolve({ enclosure: { url: "briefing/url" } }),
  getLatestPodcast: () =>
    Promise.resolve({
      enclosure: { url: "podcast/url" },
      itunes: { subtitle: "Foo bar" }
    })
}));
const custom = require("../custom");

describe("intents/custom", () => {
  it("should start the AudioPlayer if StartBriefing is passed", async () => {
    const response = await custom({ name: "StartBriefing" }, {});
    expect(response.directives[0].type).toEqual("AudioPlayer.Play");
    expect(response.shouldEndSession).toEqual(true);
  });

  it("should start the AudioPlayer if DeeplinkStartBriefing is passed", async () => {
    const response = await custom({ name: "DeeplinkStartBriefing" }, {});
    expect(response.directives[0].type).toEqual("AudioPlayer.Play");
    expect(response.shouldEndSession).toEqual(true);
  });

  it("should start the AudioPlayer if AMAZON.YesIntent is passed", async () => {
    const response = await custom({ name: "AMAZON.YesIntent" }, {});
    expect(response.directives[0].type).toEqual("AudioPlayer.Play");
    expect(response.shouldEndSession).toEqual(true);
  });

  it("should start the AudioPlayer if StartPodcast is passed", async () => {
    const response = await custom({ name: "StartPodcast" }, {});
    expect(response.directives[0].type).toEqual("AudioPlayer.Play");
    expect(response.shouldEndSession).toEqual(true);
  });

  it("should start the AudioPlayer if AMAZON.ResumeIntent is passed", async () => {
    const response = await custom(
      { name: "AMAZON.ResumeIntent" },
      { AudioPlayer: { token: "abc", offsetInMilliseconds: 10 } }
    );
    expect(response.directives[0].type).toEqual("AudioPlayer.Play");
    expect(response.shouldEndSession).toEqual(true);
  });

  it("should stop the AudioPlayer if AMAZON.CancelIntent is passed", async () => {
    const response = await custom(
      { name: "AMAZON.CancelIntent" },
      { AudioPlayer: {} }
    );
    expect(response.directives[0].type).toEqual("AudioPlayer.Stop");
    expect(response.shouldEndSession).toEqual(true);
  });

  it("should stop the AudioPlayer if AMAZON.StopIntent is passed", async () => {
    const response = await custom(
      { name: "AMAZON.StopIntent" },
      { AudioPlayer: {} }
    );
    expect(response.directives[0].type).toEqual("AudioPlayer.Stop");
    expect(response.shouldEndSession).toEqual(true);
  });

  it("should stop the AudioPlayer if AMAZON.NoIntent is passed", async () => {
    const response = await custom(
      { name: "AMAZON.NoIntent" },
      { AudioPlayer: {} }
    );
    expect(response.directives[0].type).toEqual("AudioPlayer.Stop");
    expect(response.shouldEndSession).toEqual(true);
  });

  it("should stop the AudioPlayer if AMAZON.PauseIntent is passed", async () => {
    const response = await custom(
      { name: "AMAZON.PauseIntent" },
      { AudioPlayer: { token: "abc", offsetInMilliseconds: 10 } }
    );
    expect(response.directives[0].type).toEqual("AudioPlayer.Stop");
    expect(response.shouldEndSession).toEqual(false);
  });

  it("should stop the AudioPlayer if AMAZON.HelpIntent is passed", async () => {
    const response = await custom({ name: "AMAZON.HelpIntent" });
    expect(response).toEqual({
      outputSpeech: {
        type: "PlainText",
        text:
          "Every morning Natalie Sawyer delivers the inside line from the England camp and the best World Cup analysis from our award-winning writers in Russia, just say: 'Alexa, ask Times Sport for the latest World Cup briefing'. Would you like to hear the briefing now?"
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
          "I'm sorry, I didn't understand what you said. Would you like to hear the daily briefing?"
      },
      shouldEndSession: false
    });
  });
});
