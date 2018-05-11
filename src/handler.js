const asyncResponse = require("./helpers/async-response");
const isEventValid = require("./helpers/is-event-valid");
const custom = require("./intents/custom");

const makeRequest = ({ request }) => {
  switch (request.type) {
    case "LaunchRequest": // When the skill is first launched
      return asyncResponse(custom("StartBriefing"));

    case "IntentRequest": // When the user makes an voice request, like asking a question
      return asyncResponse(custom(request.intent));

    case "SessionEndedRequest":
      return asyncResponse(Promise.resolve());

    default:
      return asyncResponse(Promise.reject("Unable to handle request"));
  }
};

module.exports.getUpdate = async (event, context, callback) => {
  if (!isEventValid(event)) {
    callback("Request made from invalid application");
    return;
  }

  const { err, response } = await makeRequest(event);

  if (err) {
    callback(err);
    return;
  }

  callback(null, {
    version: "1.0",
    response
  });
};
