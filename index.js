const app = require('./app')

module.exports = {
  start: (port) => app.listen(port, () => console.log(`Listening on port ${port}`))
}

