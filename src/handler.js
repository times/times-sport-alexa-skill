const asyncResponse = require("./helpers/async-response");
const isEventValid = require("./helpers/is-event-valid");
const custom = require("./intents/custom");

const makeRequest = async event => {
  const { request, context } = event;

  switch (request.type) {
    case "LaunchRequest": // When the skill is first launched
      return asyncResponse(custom({ name: "StartBriefing" }, context));

    case "IntentRequest": // When the user makes a voice request, like asking a question
      return asyncResponse(custom(request.intent, context));

    case "SessionEndedRequest":
      return asyncResponse(Promise.resolve());

    case "AudioPlayer.PlaybackNearlyFinished":
      console.log("Playback almost over!");
      return asyncResponse(null);

    case "AudioPlayer.PlaybackStopped":
      console.log("Playback stopped!");
      return asyncResponse(null);

    case "System.ExceptionEncountered":
      return asyncResponse(null);

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
