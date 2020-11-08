/* * * * * * * * * * * * * * * * * * *
 *
 *  PATH: src/models/BasicAuth.js
 *
 * * * * * * * * * * * * * */
const crypto = require('crypto')
const { AuthDb } = require('../database/auth')

class BasicAuth {
  constructor ({ user, scope, token }) {
    Object.assign(this, { user, scope, token })
  }

  static async authorize(data) {
    const token = await AuthDb.findToken(BasicAuth.model(data))
    if (token) return token

    const newRecord = await AuthDb.insertOne(BasicAuth.model(data))

    if ( !newRecord.insertedId ) {
      return false
    }

    await AuthDb.update({ _id: newRecord.insertedId }, {
      token: BasicAuth.generateToken(newRecord.insertedId.toString())
    })

    return await AuthDb.findToken(BasicAuth.model(data))
  }

  static model(data) {
    return data instanceof BasicAuth ? data : new BasicAuth(data)
  }

  static getUser(data) {
    return BasicAuth.model(data).user
  }

  static addKey(data) {
    return { ...BasicAuth.model(data), token: BasicAuth.generateApiKey() }
  }

  static generateToken(str) {
    return crypto.createHash('md5').update(
      `${str}${crypto.randomBytes(16).toString('hex')}${process.env.SALT}`
    ).digest('hex')
  }
}

module.exports = BasicAuth
