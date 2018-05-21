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

  it("should respond", () => {
    isEventValid.mockImplementation(() => true);

    getUpdate(
      {
        version: "1.0",
        session: {
          new: true,
          sessionId:
            "amzn1.echo-api.session.69f6ed2c-b83c-41cc-ab7a-b548078a1675",
          application: {
            applicationId:
              "amzn1.ask.skill.422d7694-295f-405f-b6b8-0844b1d98bb3"
          },
          user: {
            userId:
              "amzn1.ask.account.AEWPVX4TRG4MJIMWDQOM3DTTZEBVDBQDLWNV6UVO73YSTQIYJ454DEJWYDCWO3RAWRFHLFACJIV2QKJE6M2J6ZXP46ZZ6FRMDNKAWMIF4M4AKPPUYVMX5N77MKQTPZJCMWXS3PQCLTAD7O5F32I2QRSKUGPQOLVKQLH5AJKM423PSX276VH3TLGDKYZPKS6MYAOKTO3KQTW3WUY"
          }
        },
        context: {
          AudioPlayer: {
            playerActivity: "IDLE"
          },
          Display: {},
          System: {
            application: {
              applicationId:
                "amzn1.ask.skill.422d7694-295f-405f-b6b8-0844b1d98bb3"
            },
            user: {
              userId:
                "amzn1.ask.account.AEWPVX4TRG4MJIMWDQOM3DTTZEBVDBQDLWNV6UVO73YSTQIYJ454DEJWYDCWO3RAWRFHLFACJIV2QKJE6M2J6ZXP46ZZ6FRMDNKAWMIF4M4AKPPUYVMX5N77MKQTPZJCMWXS3PQCLTAD7O5F32I2QRSKUGPQOLVKQLH5AJKM423PSX276VH3TLGDKYZPKS6MYAOKTO3KQTW3WUY"
            },
            device: {
              deviceId:
                "amzn1.ask.device.AGXEW2NR3I6VPRAK4DZY3AOZ6YAPEDP5VS56IUX6CSSKA66UZFBSEKROAQY7FU4F3AO72IROQPOAB2QPO3DT3ZX4JAC75JOUOXZ4AEXYZ4WWSP3QMRZVMGOHDWPQL6QULMN4MCLNG6A3JCCEJB5GZI4ZHPZA",
              supportedInterfaces: {
                AudioPlayer: {},
                Display: {
                  templateVersion: "1.0",
                  markupVersion: "1.0"
                }
              }
            },
            apiEndpoint: "https://api.eu.amazonalexa.com",
            apiAccessToken:
              "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ.eyJhdWQiOiJodHRwczovL2FwaS5hbWF6b25hbGV4YS5jb20iLCJpc3MiOiJBbGV4YVNraWxsS2l0Iiwic3ViIjoiYW16bjEuYXNrLnNraWxsLjQyMmQ3Njk0LTI5NWYtNDA1Zi1iNmI4LTA4NDRiMWQ5OGJiMyIsImV4cCI6MTUyNjkxNzU4OSwiaWF0IjoxNTI2OTEzOTg5LCJuYmYiOjE1MjY5MTM5ODksInByaXZhdGVDbGFpbXMiOnsiY29uc2VudFRva2VuIjpudWxsLCJkZXZpY2VJZCI6ImFtem4xLmFzay5kZXZpY2UuQUdYRVcyTlIzSTZWUFJBSzREWlkzQU9aNllBUEVEUDVWUzU2SVVYNkNTU0tBNjZVWkZCU0VLUk9BUVk3RlU0RjNBTzcySVJPUVBPQUIyUVBPM0RUM1pYNEpBQzc1Sk9VT1haNEFFWFlaNFdXU1AzUU1SWlZNR09IRFdQUUw2UVVMTU40TUNMTkc2QTNKQ0NFSkI1R1pJNFpIUFpBIiwidXNlcklkIjoiYW16bjEuYXNrLmFjY291bnQuQUVXUFZYNFRSRzRNSklNV0RRT00zRFRUWkVCVkRCUURMV05WNlVWTzczWVNUUUlZSjQ1NERFSldZRENXTzNSQVdSRkhMRkFDSklWMlFLSkU2TTJKNlpYUDQ2Wlo2RlJNRE5LQVdNSUY0TTRBS1BQVVlWTVg1Tjc3TUtRVFBaSkNNV1hTM1BRQ0xUQUQ3TzVGMzJJMlFSU0tVR1BRT0xWS1FMSDVBSktNNDIzUFNYMjc2VkgzVExHREtZWlBLUzZNWUFPS1RPM0tRVFczV1VZIn19.NwSBSg6qOConjmfadCrpPOH_8-80enjKVbemCviw7I7-YIm8gJ_rl3T-6F4Znhl5p5zJdxzD-phPiqWqtriXZMmapEtjtGwDCfe3xJUyaI_BbGO0g8QihP1MgiwBms5jJ3BV6xlQSXZ9I_qCM5r2tSuuXRSCMX9n8GjxfNEdayfJlk3YSfWsqo02J_Nhe-YGG-x4mF6S6-rrwjf7hAwi7Saw0xOsWnES2NQe1bKElkJm4K4pIv6mrp2l51HSsEDMjSKTqtmbsTRivPPHOvR6-bwkkbyuNL8X-nkKbrxXq9avUqgQOrsEOrAEBS2cb8eweqdZ5hPPTFVo-9JDwvj5Ug"
          }
        },
        request: {
          type: "IntentRequest",
          requestId:
            "amzn1.echo-api.request.26dd34db-cd6d-44fc-9fec-8bbd9d359205",
          timestamp: "2018-05-21T14:46:29Z",
          locale: "en-GB",
          intent: {
            name: "StartBriefing",
            confirmationStatus: "NONE"
          }
        }
      },
      {},
      (error, response) => {
        expect(response).toEqual({});
      }
    );
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
