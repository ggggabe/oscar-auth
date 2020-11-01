/*
 * PATH: src/models/index.js
 *
 */

const OAuthClient = require('./OAuthClient')
const Authentication = require('./Authentication')
const Request = require('./Request')
const Response = require('./Response')
const { AuthDb } = require('../database/auth')
const { AccessToken, AuthorizationGrant } = require('./Tokens')

class OAuth {
  async static registerClient (client) {
    const model = OAuthClient.getModel(client)
    const existingClient = await AuthDb.findClient(model)

    if (existingClient) return existingClient

    model.clientSecret = OAuthClient.generateClientSecret()


    /* Attempt to add new client to DB */
    let result, retries = 3

    while (!result.insertedId && retries) {
      result = await AuthDb.insertOne(model)
      retries--
    }

    /* Failed attempt, return */
    if (!result.insertedId) {
      delete model.clientSecret

      return model
    }
    const { insertedId } = result

    /* generate and attempt to add client_id to doc*/
    model.clientId = OAuthClient.generateClientId(result.insertedId)

    result = null
    retries = 3

    while (!result && retries) {
      result = await AuthDb.addClientId(result.insertedId, model.clientId)
      retries--
    }

    /* Failed to add clientId, delete the whole thing */
    if (!result) {
      result = await AuthDb.deleteByMongoId(insertedId)

      delete model.clientId
      delete model.clientSecret
    }

    return model
  }


  async static handleAuthorizationRequest({
    client_id,
    response_type: responseType,
    redirect_uri: redirectURI,
    scope,
    state
  }) {
    const authRequestModel = Request.AuthorizationRequest.getModel({
      clientId: client_id,
      responseType,
      redirectURI,
      scope,
      state
    })

    if (!authRequestModel.valid) return Request.Errors.invalidRequest()

    const clientModel = OAuthClient.getModel(authRequestModel)

    if (!(await Authentication.authenticate(clientModel))) return Request.Errors.unauthorizedRequest()

    const authGrant = AuthorizationGrant.generate(scope)
    const authGrantResult = await AuthDb.addAuthGrant(
      clientModel,
      authGrant,
      scope
    )

    if (!authGrantResult) return {
      body: {
        code: 500,
        message: 'unable to add authorization grant to db'
      }
    }

    return Response.authorizationGrant({
      code: authGrant,
      state: authRequestModel.state,
      redirectURI,
    })
  }

  async static handleAccessTokenRequest({
    grant_type: grantType,
    code,
    redirect_uri: redirectURI,
    client_id: clientId
  }) {
    const grantModel = AuthorizationGrant.getModel({
      grantType,
      code,
      redirectURI,
      clientId
    })

    const clientModel = OAuthClient.getModel(grantModel)

    if (!(await Authentication.authenticate(clientModel))) return Request.Errors.unauthorizedRequest()
    if (!(await AuthorizationGrant.authenticate(grantModel))) return Request.Errors.unauthorizedRequest()

    const accessToken = AccessToken.generate()

    if (!(await AuthDb.addAccessToken(clientModel, accessToken))) return {
      body: {
        code: 500,
        message: 'unable to add access token to clientId in db'
      }
    }

    return Response.accessToken(accessToken)
  }
}

module.exports = OAuth


/* * * * * * * * * * * * * * TODO
 *
 * 11/1/20
 * Cover all errors, and handle refreshing the tokesn.
 * Write tests, AuthDb doesn't exist yet
 *
 *
 *
 * * * * * * * * * * * * * * * * * /
