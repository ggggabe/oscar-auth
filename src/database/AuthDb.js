/* * * * * * * * * * * * * * * * * *
 * PATH: src/database/auth.js
 *
 * A simple, testable, easy to
 * replicate, wrapper for managing
 * the collection of users of
 * whatever database we're using.
 *
 * * * * * * * * * * * * * * * * * */

const { ObjectId } = require('mongodb')
const { MongoDb, MongoDbCollection } = require('../models/database')
const COLLECTION = 'auth'

class AuthDb {

  constructor ({
    _id,
    user,
    scope,
    token
  }) {
    Object.assign(this, {
      _id,
      user,
      scope,
      token,
    })
  }

  static model(data) {
    return data instanceof AuthDb ? data : new AuthDb(data)
  }

  /* * * * * * * * * * *
   *
   *            PAYLOADS
   *
   * * * * * * * * * * */

  static getCreatePayload({
    user,
    scope
  }) {
    return {
      user,
      scope,
    }
  }

  static getUpdatePayload({ user, scope, token }) {
    const data = { user, scope, token }
    const copy = {}

    Object.keys(data).forEach( field => {
      if (data[field] !== undefined) {
        copy[field] = data[field]
      }
    })

    return copy
  }

  static getIdPayload({ id: _id }) {
    return { _id }
  }

  /* * * * * * * * * * *
   *
   *         DB REQUESTS
   *
   * * * * * * * * * * */

  static async list() {
    return await MongoDbCollection.findAll(COLLECTION)
  }

  static async create(data) {
    const payload = AuthDb.getCreatePayload(data)
    const id = await MongoDbCollection.insertOne(COLLECTION, payload)

    return { id }
  }

  static async read(data) {
    const foundData = await MongoDbCollection.findOne(
      COLLECTION,
      ObjectId(AuthDb.model(data)._id)
  )

    return AuthDb.model(foundData)
  }

  static async update(data) {
    const payload = getUpdatePayload(data)
    const result = await MongoDbCollection.updateOne(
      COLLECTION,
      ObjectId(AuthDb.model(data)._id),
      payload
    )

    const foundData = await MongoDbCollection.findOne(
      COLLECTION,
      ObjectId(AuthDb.model(data)._id)
    )

    return AuthDb.model(foundData)
  }
}

module.exports = {
  AuthDb
}
