/*
 * PATH: src/models/OAuth/Request.js
 *
 */

const INVALID_REQUEST_CODE = 400
const INVALID_REQUEST_ERROR = 'invalid_request'
const INVALID_REQUEST_MESSAGE = 'Bad request'

const UNAUTHORIZED_REQUEST_CODE = 401
const UNAUTHORIZED_REQUEST_ERROR = 'unauthorized_client'
const UNAUTHORIZED_REQUEST_MESSAGE = 'Unauthorized client'

class Errors {
  static invalidRequest() {
    return {
      body: {
        message: INVALID_REQUEST_MESSAGE,
        error: INVALID_REQUEST_ERROR,
        code: INVALID_REQUEST_CODE
      }
    }
  }

  static unauthorizedRequest() {
    return {
      body: {
        message: UNAUTHORIZED_REQUEST_MESSAGE,
        error: UNAUTHORIZED_REQUEST_ERROR,
        code: UNAUTHORIZED_REQUEST_CODE
      }
    }
  }
}

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

module.exports = {
  AuthorizationRequest,
  Errors
}
