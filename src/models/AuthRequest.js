/*
 * PATH: src/models/AuthRequest.js
 *
 */

class AuthorizationRequest {
  constructor ({
    responseType,
    clientId,
    redirectURI,
    scope,
    state
  }) {
    this.responseType = responseType
    this.clientId = clientId
    this.redirectURI = redirectURI
    this.scope = scope
    this.state = state
  }
}
