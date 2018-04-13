const config = require("./config");

// Validation methods all live in here
const isEventValid = ({ session }) => {
  try {
    // Check if the event's applicationId matches the one this app is set up to use
    return session.application.applicationId === config.applicationId;
  } catch (e) {
    return false;
  }
};

const asyncResponse = res => res.then(a => [null, a]).catch(e => [e, null]);

module.exports = {
  isEventValid,
  asyncResponse
};
