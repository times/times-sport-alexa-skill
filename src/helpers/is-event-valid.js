const { applicationId } = require("./config");

module.exports = ({ session }) => {
  try {
    // Check if the event's applicationId matches the one this app is set up to use
    return session.application.applicationId === applicationId;
  } catch (e) {
    return false;
  }
};
