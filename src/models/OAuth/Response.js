/*
 * PATH: src/models/OAuth/Response.js
 *
 */

class Response {
  static accessToken (accessToken, redirectURI) {
    return {
      uri: redirectURI,
      params: {
        access_token: accessToken.accessToken,
        token_type: accessToken.tokenType,
        expires_in: accessToken.expiresIn,
        scope: accessToken.scope,
        state: accessToken.state
      }
    }
  }

  static authorizationGrant (grant) {
    return {
      redirect_uri: grant.redirectURI,
      params: {
        code: grant.code,
        state: grant.state
      }
    }
  }
}

module.exports = {
  Response
}
