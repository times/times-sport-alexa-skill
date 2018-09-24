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
jest.mock("universal-analytics", () => () => ({
  event: (_, cb) => cb()
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
                      contentDescription:
                        "The Times Sport Premier League briefing logo",
                      sources: [
                        {
                          heightPixels: "640",
                          size: "MEDIUM",
                          url:
                            "https://nuk-tnl-editorial-prod-staticassets.s3.amazonaws.com/public/2018/times-sport-alexa-skill/assets/alexa-show-image-960x640.png",
                          widthPixels: "960"
                        }
                      ]
                    },
                    subtitle: "Natalie Sawyer previews the weekend’s matches",
                    title: "Times Sport Premier League Briefing"
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
