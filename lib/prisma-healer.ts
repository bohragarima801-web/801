import { PrismaClient } from '@prisma/client'
import { prisma } from './prisma'

/**
 * Executes a database query with automatic retry logic for transient errors.
 * This prevents the application from crashing when the DB drops a connection or is busy.
 */
export async function withPrismaHeal<T>(
  queryFn: (client: PrismaClient) => Promise<T>,
  options = { retries: 3, delayMs: 1000 }
): Promise<T> {
  let lastError: any

  for (let attempt = 1; attempt <= options.retries; attempt++) {
    try {
      return await queryFn(prisma)
    } catch (err: any) {
      lastError = err
      
      // Known Prisma error codes that are "transient" or safe to retry:
      // P2024: Timed out fetching a new connection from the connection pool
      // P2028: Transaction API error
      // P1001: Can't reach database server
      // P1008: Operations timed out
      const isTransient = err?.code === 'P2024' || err?.code === 'P1001' || err?.code === 'P1008'

      if (isTransient && attempt < options.retries) {
// console.warn(`[Prisma Auto-Heal] DB query failed (attempt ${attempt}/${options.retries}). Retrying in ${options.delayMs}ms...`) (removed for production)
        await new Promise((res) => setTimeout(res, options.delayMs * attempt))
        continue
      }
      
      // If it's a known non-transient error (like unique constraint violation), we throw it
      // so the Safe API Wrapper can translate it into a friendly message.
      throw err
    }
  }

  throw lastError
}

/**
 * Translates Prisma error codes into human-readable, safe messages without leaking DB internals.
 */
export function translatePrismaError(err: any): string {
  if (!err || typeof err !== 'object') return 'An unexpected database error occurred.'

  switch (err.code) {
    case 'P2002':
      return 'This record already exists. Please use different unique details (e.g., email or name).'
    case 'P2003':
      return 'Operation failed because it references a related record that does not exist.'
    case 'P2025':
      return 'The record you are trying to update or delete could not be found.'
    case 'P2024':
    case 'P1001':
    case 'P1008':
      return 'The database is currently busy or unreachable. Please try again in a few moments.'
    default:
      if (err.message && err.message.includes('PrismaClientKnownRequestError')) {
        return 'A database constraint was violated.'
      }
      return 'An internal database error occurred.'
  }
}
