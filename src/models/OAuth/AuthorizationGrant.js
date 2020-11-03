/*
 * PATH: src/models/AuthorizationGrant.js
 *
 */

const { AuthDb } = require('../database/auth')

const TYPE_CODE = 0
const TYPE_IMPLICIT = 1
const TYPE_RESOURCE_OWNER_PASS_CREDS = 2
const TYPE_CLIENT_CREDS = 3

class AuthorizationGrant {
  constructor({grantType, code, redirectURI}) {
    this.grantType = grantType
    this.code = code
    this.redirectURI = redirectURI
    this.clientId
  }

  static getModel (grant) {
    if (grant instanceof AuthorizationGrant) return grant

    return new AuthorizationGrant(grant)
  }

  /*
   * Given a resource, see if a grant exists
   */
  async static authenticate (grant) {
    const grantModel = AuthorizationGrant.getModel(grant)
    const clientModel = OAuthClient.getModel(grantModel)

    const dbClientResult = await AuthDb.findClient(clientModel)

    return dbClient.authGrant && dbClient.authGrant === grantModel.code
  }

  static generate () {
    return crypto.randomBytes(16).toString('hex')
  }
}

class AccessToken {
  constructor ({
    accessToken,
    tokenType,
    expiresIn,
    refreshToken,
  }) {
    this.accessToken = accessToken
    this.tokenType = tokenType
    this.expiresIn = expiresIn
    this.refreshToken = refreshToken
  }

  static generate () {
    const accessTokenModel = new AccessToken({
      accessToken: crypto.randomBytes(16).toString('hex'),
      tokenType: 'bearer'
    })
  }
}

module.exports = {
  AuthorizationGrant,
  AccessToken,
}
