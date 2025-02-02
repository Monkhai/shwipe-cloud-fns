import { Connector, IpAddressTypes } from '@google-cloud/cloud-sql-connector'
import pg from 'pg'

const { Pool } = pg

// Create a single connector instance that can be reused
const connector = new Connector()

// Initialize the pool outside the function
let pool: pg.Pool | null = null

export const getPool = async () => {
  if (!pool) {
    const clientOpts = await connector.getOptions({
      instanceConnectionName: config.db.instanceConnectionName,
      ipType: IpAddressTypes.PUBLIC,
    })

    pool = new Pool({
      ...clientOpts,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      max: 5, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    })

    // Handle pool errors
    pool.on('error', err => {
      console.error('Unexpected error on idle client', err)
    })
  }
  return pool
}

// Cleanup function to be called when shutting down
export const closePool = async () => {
  if (pool) {
    await pool.end()
    pool = null
  }
  connector.close()
}

export const config = {
  db: {
    instanceConnectionName: 'shwipe-bda3b:us-central1:shwipe-db',
    user: 'postgres',
    password: process.env.DB_PASSWORD || 'qY=tm`;zo9+$ptML', // Better to use environment variables
    database: 'postgres',
  },
}
