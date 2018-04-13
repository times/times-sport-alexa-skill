module.exports = res =>
  res
    .then(response => ({ err: null, response }))
    .catch(err => ({ err, response: null }));
