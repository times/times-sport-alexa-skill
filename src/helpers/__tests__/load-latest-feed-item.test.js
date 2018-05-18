jest.genMockFromModule("rss-parser");
jest.mock("rss-parser");
const Parser = require("rss-parser");
const loadLatestFeedItem = require("../load-latest-feed-item");

describe("#loadLatestFeedItem()", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return the latest item", async () => {
    const mockParseURL = jest.fn(() =>
      Promise.resolve({
        items: [
          {
            foo: "bar"
          },
          {
            foo: "baz"
          }
        ]
      })
    );
    Parser.mockImplementation(() => ({
      parseURL: mockParseURL
    }));

    const result = await loadLatestFeedItem("url");

    expect(mockParseURL).toHaveBeenCalledWith("url");
    expect(result).toEqual({
      foo: "bar"
    });
  });

  it("should return null if there are no items", async () => {
    const mockParseURL = jest.fn(() =>
      Promise.resolve({
        items: []
      })
    );
    Parser.mockImplementation(() => ({
      parseURL: mockParseURL
    }));

    const result = await loadLatestFeedItem("url");

    expect(result).toEqual(null);
  });
});
