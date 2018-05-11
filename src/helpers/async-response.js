module.exports = res =>
  Promise.resolve(res)
    .then(response => ({ err: null, response }))
    .catch(err => ({ err, response: null }));
