jest.mock("../helpers/is-event-valid", () => jest.fn());
jest.mock("../helpers/get-audio-data", () => ({
  getLatestBriefing: () =>
    Promise.resolve({ url: "https://www.thetimes.co.uk" })
}));

const isEventValid = require("../helpers/is-event-valid");
const { getUpdate } = require("../handler");

describe("integration test", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should work", done => {
    const request = {
      version: "1.0",
      session: {
        new: true,
        sessionId:
          "amzn1.echo-api.session.037c38cb-e9e6-462f-8418-566e3528d21e",
        application: {
          applicationId: "amzn1.ask.skill.5493b6f4-d7ee-4ff4-b784-fc0d8fa3dada"
        }
      },
      context: {
        AudioPlayer: {
          playerActivity: "IDLE"
        },
        System: {
          application: {
            applicationId:
              "amzn1.ask.skill.5493b6f4-d7ee-4ff4-b784-fc0d8fa3dada"
          },
          device: {
            supportedInterfaces: {
              AudioPlayer: {},
              Display: {
                templateVersion: "1.0",
                markupVersion: "1.0"
              }
            }
          }
        }
      },
      request: {
        type: "IntentRequest",
        requestId:
          "amzn1.echo-api.request.77116ede-c7dc-4342-91c8-e3107d93d170",
        timestamp: "2018-05-18T13:59:42Z",
        locale: "en-GB",
        intent: {
          name: "StartBriefing",
          confirmationStatus: "NONE"
        }
      }
    };
    isEventValid.mockImplementation(() => true);

    getUpdate(request, {}, (error, response) => {
      expect(error).toEqual(null);
      expect(response).toEqual({
        response: {
          directives: [
            {
              audioItem: {
                stream: {
                  offsetInMilliseconds: 0,
                  token: "the-times-world-cup-briefing",
                  url: "https://www.thetimes.co.uk"
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
    });
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
                    token: "the-times-world-cup-briefing",
                    url: "https://www.thetimes.co.uk"
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
