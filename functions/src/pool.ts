import { error } from 'firebase-functions/logger'
import pg from 'pg'
import { logger } from './logger'
const { Pool } = pg
import path from 'path'
import fs from 'fs'
const DB_PASSWORD = 'qxk*NQG5gau9key-edu'

export const getPool = async () => {
  const caPath = path.join(__dirname, './prod-ca-2021.crt')
  const caFile = fs.readFileSync(caPath)

  const pool = new Pool({
    connectionString: `postgresql://postgres.xbmpgyybutdgjmvexqsr:${DB_PASSWORD}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`,
    ssl: {
      ca: caFile,
      rejectUnauthorized: true,
    },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  })

  // Handle pool errors
  pool.on('error', err => {
    error('Unexpected error on idle client', err)
    logger.logError(`Unexpected error on idle client: ${err}`)
  })
  return pool
}
