/*
 * PATH: src/models/Authentication.js
 *
 */

const { AuthDb } = require('../database/auth')

class Authentication {
  async static authenticate (clientId) {
    const client = await AuthDb.findOne({ clientId })

    return client
  }

  async static authenticateWithSecret (clientId, clientSecret) {
    const client = await AuthDb.findOne({ clientId, clientSecret })

    return client
  }
}

module.exports = Authentication
