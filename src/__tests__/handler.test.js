jest.mock("../helpers/is-event-valid", () => jest.fn());
jest.mock("../intents/custom", () => jest.fn());

const { getUpdate } = require("../handler");
const isEventValid = require("../helpers/is-event-valid");
const custom = require("../intents/custom");

describe("handler#getUpdate()", () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it("should call the callback with an error if the event is invalid", done => {
    isEventValid.mockImplementation(() => false);

    getUpdate({}, {}, (error, response) => {
      expect(response).toBeUndefined();
      expect(error).toEqual("Request made from invalid application");
      done();
    });
  });

  it("should call the callback with an error the request cannot be handled", done => {
    isEventValid.mockImplementation(() => true);

    getUpdate(
      {
        request: {
          type: "SomeInvalidRequestType"
        }
      },
      {},
      (error, response) => {
        expect(response).toBeUndefined();
        expect(error).toEqual("Unable to handle request");
        done();
      }
    );
  });

  it("should call the callback with an error if LaunchRequest fails", done => {
    isEventValid.mockImplementation(() => true);
    custom.mockImplementation(() => Promise.reject());

    getUpdate(
      {
        request: {
          type: "SomeInvalidRequestType"
        }
      },
      {},
      (error, response) => {
        expect(response).toBeUndefined();
        expect(error).toEqual("Unable to handle request");
        done();
      }
    );
  });

  it("should call the callback with a valid response for a LaunchRequest", done => {
    isEventValid.mockImplementation(() => true);
    custom.mockImplementation(() => Promise.resolve("Valid response"));

    getUpdate(
      {
        request: {
          type: "LaunchRequest"
        }
      },
      {},
      (error, response) => {
        expect(error).toEqual(null);
        expect(response).toEqual({
          version: "1.0",
          response: "Valid response"
        });
        done();
      }
    );
  });

  it("should call the callback with a valid response for an IntentRequest", done => {
    isEventValid.mockImplementation(() => true);
    custom.mockImplementation(() => Promise.resolve("Valid response"));

    getUpdate(
      {
        request: {
          type: "IntentRequest",
          intent: {
            foo: "bar"
          }
        },
        context: {
          foo: "baz"
        }
      },
      {},
      (error, response) => {
        expect(custom).toBeCalledWith(
          {
            foo: "bar"
          },
          {
            foo: "baz"
          }
        );
        expect(error).toEqual(null);
        expect(response).toEqual({
          version: "1.0",
          response: "Valid response"
        });
        done();
      }
    );
  });

  it("should call the callback with a valid response for an SessionEndedRequest", done => {
    isEventValid.mockImplementation(() => true);

    getUpdate(
      {
        request: {
          type: "SessionEndedRequest"
        }
      },
      {},
      (error, response) => {
        expect(error).toEqual(null);
        expect(response).toEqual({
          version: "1.0"
        });
        done();
      }
    );
  });

  it("should call the callback with a null response for an AudioPlayer.PlaybackNearlyFinished", done => {
    isEventValid.mockImplementation(() => true);

    getUpdate(
      {
        request: {
          type: "AudioPlayer.PlaybackNearlyFinished"
        }
      },
      {},
      (error, response) => {
        expect(error).toEqual(null);
        expect(response).toEqual({
          version: "1.0"
        });
        done();
      }
    );
  });

  it("should call the callback with a null response for an AudioPlayer.PlaybackStopped", done => {
    isEventValid.mockImplementation(() => true);

    getUpdate(
      {
        request: {
          type: "AudioPlayer.PlaybackStopped"
        }
      },
      {},
      (error, response) => {
        expect(error).toEqual(null);
        expect(response).toEqual({
          version: "1.0"
        });
        done();
      }
    );
  });

  it("should call the callback with a valid response for an PlaybackController.PlayCommandIssued", done => {
    isEventValid.mockImplementation(() => true);
    custom.mockImplementation(() => Promise.resolve("Valid response"));

    getUpdate(
      {
        request: {
          type: "PlaybackController.PlayCommandIssued"
        },
        context: {
          foo: "baz"
        }
      },
      {},
      (error, response) => {
        expect(custom).toBeCalledWith(
          {
            name: "AMAZON.ResumeIntent"
          },
          {
            foo: "baz"
          }
        );
        expect(error).toEqual(null);
        expect(response).toEqual({
          version: "1.0",
          response: "Valid response"
        });
        done();
      }
    );
  });

  it("should call the callback with a valid response for an PlaybackController.PauseCommandIssued", done => {
    isEventValid.mockImplementation(() => true);
    custom.mockImplementation(() => Promise.resolve("Valid response"));

    getUpdate(
      {
        request: {
          type: "PlaybackController.PauseCommandIssued"
        }
      },
      {},
      (error, response) => {
        expect(custom).toBeCalledWith({
          name: "AMAZON.PauseIntent"
        });
        expect(error).toEqual(null);
        expect(response).toEqual({
          version: "1.0",
          response: "Valid response"
        });
        done();
      }
    );
  });

  it("should call the callback with the error message in the response for an System.ExceptionEncountered", done => {
    isEventValid.mockImplementation(() => true);

    getUpdate(
      {
        request: {
          type: "System.ExceptionEncountered",
          error: {
            message: "Some error message"
          }
        }
      },
      {},
      error => {
        expect(error).toEqual("Some error message");
        done();
      }
    );
  });
});
