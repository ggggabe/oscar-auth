/*
 * PATH: src/models/client.js
 *
 */

const crypto = require('crypto')

const TYPE_CONFIDENTIAL = 0
const TYPE_PUBLIC = 1
const PROFILE_WEB_SERVER_APP = 0
const PROFILE_USER_AGENT = 1
const PROFILE_NATIVE_APP = 2

class OAuthClient {
  constructor ({
    clientId = '',
    clientSecret = '',
    redirectURI = '',
    profile = '',
    type = '',
    authGrant = '',
  }) {
    this.type = type
    this.profile = profile
    this.clientId = clientId
    this.redirectURI = redirectURI
    this.authGrant = authGrant
  }

  static getModel(client) {
    if (client instanceof OAuthClient) return client

    return new OAuthClient(client)
  }

  static generateClientId (str) {
    const model = OAuthClient.getModel(client)

    return crypto.createHash('md5')
      .update(`${str}`)
      .digest('hex')
  }

  static generateClientSecret () {
    return crypto.randomBytes(16).toString('hex')
  }
}

module.exports = OAuthClient
