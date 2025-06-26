import env from './environment.js'
import assert from 'assert'
import { MongoClient, ServerApiVersion } from 'mongodb'

const MONGO_URI = env.MONGODB_URI
const DATABASENAME = env.DATABASE_NAME

let mongoDbInstance = null

const mongoDbClient = new MongoClient(MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CONNECT_DB = async () => {
  await mongoDbClient.connect()

  mongoDbInstance = mongoDbClient.db(DATABASENAME)

  assert(mongoDbInstance, 'mongoDbInstance must exist')

  await mongoDbClient.db(DATABASENAME).command({ ping: 1 })
}

export const GET_DB = () => {
  if (!mongoDbInstance) throw new Error('Must connect to Database first')

  return mongoDbInstance
}

export const CLOSE_DB = async () => {
  await mongoDbClient.close()
}

export const GET_NEW_SESSION = () => {
  return mongoDbClient.startSession()
}
