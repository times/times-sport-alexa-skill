const { alexa } = require("../config");

module.exports = ({ session }) => {
  if (!session) return true;

  try {
    // Check if the event's applicationId matches the one this app is set up to use
    return session.application.applicationId === alexa.applicationId;
  } catch (e) {
    return false;
  }
};
