jest.mock("../helpers/is-event-valid", () => jest.fn());
jest.mock("../helpers/get-audio-data", () => ({
  getLatestBriefing: () =>
    Promise.resolve({
      enclosure: { url: "https://www.thetimes.co.uk/briefing" }
    }),
  getLatestPodcast: () =>
    Promise.resolve({
      enclosure: { url: "https://www.thetimes.co.uk/podcast" }
    })
}));

const isEventValid = require("../helpers/is-event-valid");
const { getUpdate } = require("../handler");

describe("integration test", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should load correctly", done => {
    isEventValid.mockImplementation(() => true);

    getUpdate(
      {
        request: {
          type: "IntentRequest",
          intent: {
            name: "StartBriefing"
          }
        }
      },
      {},
      (error, response) => {
        expect(error).toEqual(null);
        expect(response).toEqual({
          response: {
            directives: [
              {
                audioItem: {
                  metadata: {
                    art: {
                      contentDescription: "The Times World Cup briefing logo",
                      sources: [
                        {
                          heightPixels: "640",
                          size: "MEDIUM",
                          url:
                            "https://nuk-tnl-editorial-prod-staticassets.s3.amazonaws.com/public/2018/world-cup-alexa-breifing/assets/alexa-show-image-960x640.png",
                          widthPixels: "960"
                        }
                      ]
                    },
                    subtitle:
                      "Natalie Sawyer brings you the key stories from Russia",
                    title: "Times Sport World Cup Briefing"
                  },
                  stream: {
                    offsetInMilliseconds: 0,
                    token: "https://www.thetimes.co.uk/briefing",
                    url: "https://www.thetimes.co.uk/briefing"
                  }
                },
                playBehavior: "REPLACE_ALL",
                type: "AudioPlayer.Play"
              }
            ],
            shouldEndSession: true
          },
          version: "1.0"
        });
        done();
      }
    );
  });
});
