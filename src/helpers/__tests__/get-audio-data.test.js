const mockLoadLatestFeedItem = jest.fn();
jest.mock("../load-latest-feed-item", () => mockLoadLatestFeedItem);

const { getLatestPodcast, getLatestBriefing } = require("../get-audio-data");

describe("get audio date helper", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("#getLatestPodcast()", () => {
    it("should call #loadLatestFeedItem() and return the response", () => {
      mockLoadLatestFeedItem.mockImplementation(() => ({
        foo: "bar"
      }));

      expect(getLatestPodcast()).toEqual({
        foo: "bar"
      });
    });
  });

  describe("#getLatestBriefing()", () => {
    it("should return the correct value", () => {
      expect(getLatestBriefing()).toEqual({
        enclosure: {
          url:
            "https://nuk-tnl-editorial-prod-staticassets.s3.amazonaws.com/public/2018/times-sport-alexa-skill/assets/sample-briefing.mp3"
        }
      });
    });
  });
});
