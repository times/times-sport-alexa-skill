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
