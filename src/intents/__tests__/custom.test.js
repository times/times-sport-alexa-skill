jest.mock("../../helpers/get-audio-data", () => ({
  getLatestBriefing: () =>
    Promise.resolve({ enclosure: { url: "briefing/url" } }),
  getLatestPodcast: () =>
    Promise.resolve({
      enclosure: { url: "podcast/url" },
      itunes: { subtitle: "Foo bar" }
    })
}));
const mockUa = jest.fn(() => ({
  event: mockEvent
}));
const mockEvent = jest.fn((_, cb) => cb());
jest.mock("universal-analytics", () => mockUa);
const custom = require("../custom");

describe("intents/custom", () => {
  it("should pass the user ID into the Universal Analytics constructor if available", async () => {
    await custom(
      { name: "StartBriefing" },
      {
        System: {
          user: {
            userId: "foo-bar"
          }
        }
      }
    );

    expect(mockUa).toHaveBeenCalledWith(undefined, "foo-bar");
  });
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
    expect(response.shouldEndSession).toEqual(true);
  });

  it("should stop the AudioPlayer if AMAZON.HelpIntent is passed", async () => {
    const response = await custom({ name: "AMAZON.HelpIntent" });
    expect(response).toEqual({
      outputSpeech: {
        text:
          "Every morning Natalie Sawyer delivers the inside line from the England camp and the best World Cup analysis from our award-winning writers in Russia. In a bite-size update, Natalie will bring you the thoughts of writers including Henry Winter, Oliver Kay, Matt Dickinson and Alyson Rudd, along with those of Patrick Vieira, the World Cup-winning former France captain, just say: 'Alexa, ask Times Sport for the latest World Cup briefing'. Would you like to hear the latest briefing now?",
        type: "PlainText"
      },
      shouldEndSession: false
    });
  });

  it("should clear the AudioPlayer queue if AudioPlayer.PlaybackNearlyFinished is passed", async () => {
    const response = await custom({
      name: "AudioPlayer.PlaybackNearlyFinished"
    });
    expect(response).toEqual({
      directives: [
        {
          type: "AudioPlayer.ClearQueue",
          clearBehavior: "CLEAR_ENQUEUED"
        }
      ]
    });
  });

  it("should clear the AudioPlayer queue if AudioPlayer.PlaybackStopped is passed", async () => {
    const response = await custom({
      name: "AudioPlayer.PlaybackStopped"
    });
    expect(response).toEqual({
      directives: [
        {
          type: "AudioPlayer.ClearQueue",
          clearBehavior: "CLEAR_ENQUEUED"
        }
      ]
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
