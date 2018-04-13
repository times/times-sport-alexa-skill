const { isEventValid, asyncResponse } = require("./helpers");
const { launch, custom } = require("./intents");

const makeRequest = ({ request }) => {
  switch (request.type) {
    case "LaunchRequest": // When the skill is first launched
      return asyncResponse(launch());

    case "IntentRequest": // When the user makes an voice request, like asking a question
      return asyncResponse(custom(request.intent));

    case "SessionEndedRequest":
    default:
      return asyncResponse(Promise.resolve());
  }
};

module.exports.getUpdate = async (event, context, callback) => {
  if (!isEventValid(event)) {
    callback("Request made from invalid application");
    return;
  }

  const [response, err] = await makeRequest(event);

  if (err) {
    callback(err);
    return;
  }

  callback(null, {
    version: "1.0",
    response
  });
};
