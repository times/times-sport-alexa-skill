const asyncResponse = require("../async-response");

describe("#asyncResponse()", () => {
  it("should return correctly with a resolved Promise", () => {
    return asyncResponse(Promise.resolve("foobar")).then(response => {
      expect(response).toEqual({
        err: null,
        response: "foobar"
      });
    });
  });

  it("should return correctly with a rejected Promise", () => {
    return asyncResponse(Promise.reject("Some error")).then(response => {
      expect(response).toEqual({
        err: "Some error",
        response: null
      });
    });
  });

  it("should resolve when a non-Promise value is passed in", () => {
    return asyncResponse("Test").then(response => {
      expect(response).toEqual({
        err: null,
        response: "Test"
      });
    });
  });
});
