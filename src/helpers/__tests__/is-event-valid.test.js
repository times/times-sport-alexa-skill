jest.mock("../../config", () => ({
  applicationId: "abcd"
}));
const isEventValid = require("../is-event-valid");

describe("#isEventValid()", () => {
  it("should return true if the event has the correct application ID", () => {
    expect(
      isEventValid({
        session: {
          application: {
            applicationId: "abcd"
          }
        }
      })
    ).toEqual(true);
  });

  it("should return false if the event has the correct application ID", () => {
    expect(
      isEventValid({
        session: {
          application: {
            applicationId: "1234"
          }
        }
      })
    ).toEqual(false);
  });

  it("should return false if the event is of the incorrect structure", () => {
    expect(
      isEventValid({
        session: "invalid"
      })
    ).toEqual(false);
  });
});
