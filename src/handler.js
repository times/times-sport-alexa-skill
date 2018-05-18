const asyncResponse = require("./helpers/async-response");
const isEventValid = require("./helpers/is-event-valid");
const custom = require("./intents/custom");

const makeRequest = async event => {
  console.log(JSON.stringify(event.session));
  const { request, session } = event;
  switch (request.type) {
    case "LaunchRequest": // When the skill is first launched
      return asyncResponse(custom("StartBriefing", session.context));

    case "IntentRequest": // When the user makes a voice request, like asking a question
      return asyncResponse(custom(request.intent, session.context));

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
