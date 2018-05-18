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
    it("should call #loadLatestFeedItem() and return the response", () => {
      mockLoadLatestFeedItem.mockImplementation(() => ({
        foo: "baz"
      }));

      expect(getLatestBriefing()).toEqual({
        foo: "baz"
      });
    });
  });
});
