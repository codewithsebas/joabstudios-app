import 'server-only'

/**
 * Minimal structured logger. Callers pass context without personal data;
 * errors are reduced to code/message so tokens, emails or payloads from
 * third-party error objects never reach the logs.
 */
type LogContext = Record<string, string | number | boolean | null | undefined>

function describe(error: unknown): { message: string; code?: string } {
  if (error && typeof error === 'object') {
    const record = error as { message?: unknown; code?: unknown; name?: unknown }
    return {
      message: typeof record.message === 'string' ? record.message.slice(0, 300) : String(record.name ?? 'Unknown error'),
      code: typeof record.code === 'string' ? record.code : undefined,
    }
  }
  return { message: String(error).slice(0, 300) }
}

export const log = {
  error(event: string, error: unknown, context: LogContext = {}) {
    console.error(JSON.stringify({ level: 'error', event, ...context, error: describe(error) }))
  },
  warn(event: string, context: LogContext = {}) {
    console.warn(JSON.stringify({ level: 'warn', event, ...context }))
  },
}
