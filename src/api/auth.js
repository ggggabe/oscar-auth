/* * * * * * * * * * * * * * * * * * *
 *
 *  PATH: src/api/auth.js
 *
 *  Simple authentication layer
 *  for personal apps
 *
 * * * * * * * * * * * * * */

const router = require('express').Router()
const { AuthDb } = require('../database/auth')
const BasicAuth = require('../models/BasicAuth')

router.route('/')
  .post( async ({ user, scope }, res) => {
    const token = await BasicAuth.authorize({ user, scope })
    const response = token ? { token } : { code: 500, message: 'Unable to authorize.'}

    res.send(response)
  })

router.route('/:scope')
  .get( async ({ token }) => {
    const valid = await AuthDb.findToken( token )
    const response =  valid
      ? { code: 200,  authorized: true }
      : { code: 401, message: 'Unauthorized'}

    res.send(response)
  })

module.exports = app => {
  app.use('/auth', router)
}
