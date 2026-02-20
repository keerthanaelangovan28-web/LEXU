import { toast } from 'sonner'

export interface ApiError {
  status: number
  message: string
  code: string
  details?: any
}

export class LexAxiomError extends Error {
  status: number
  code: string
  details?: any

  constructor(message: string, status: number = 500, code: string = 'UNKNOWN_ERROR', details?: any) {
    super(message)
    this.status = status
    this.code = code
    this.details = details
    this.name = 'LexAxiomError'
  }
}

export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const contentType = response.headers.get('content-type')
    let errorData: any = {}

    try {
      if (contentType?.includes('application/json')) {
        errorData = await response.json()
      } else {
        errorData = { message: await response.text() }
      }
    } catch {
      errorData = { message: 'An error occurred' }
    }

    const error = new LexAxiomError(
      errorData.message || 'An error occurred',
      response.status,
      errorData.code || 'API_ERROR',
      errorData.details
    )

    console.error('[v0] API Error:', error)
    throw error
  }

  try {
    return await response.json() as T
  } catch {
    throw new LexAxiomError('Failed to parse response', 500, 'PARSE_ERROR')
  }
}

export function handleError(error: unknown, context: string = 'Unknown'): void {
  console.error(`[v0] Error in ${context}:`, error)

  if (error instanceof LexAxiomError) {
    toast.error(error.message)
  } else if (error instanceof Error) {
    toast.error(error.message || 'An error occurred')
  } else {
    toast.error('An unexpected error occurred')
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof LexAxiomError) {
    return error.message
  } else if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred'
}

export function logError(
  error: unknown,
  context: string,
  additionalInfo?: Record<string, any>
): void {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    context,
    message: getErrorMessage(error),
    ...(error instanceof LexAxiomError && {
      status: error.status,
      code: error.code,
    }),
    ...additionalInfo,
  }

  console.error('[v0] Error Log:', errorInfo)

  // In production, you could send this to a logging service
  // await fetch('/api/logs', { method: 'POST', body: JSON.stringify(errorInfo) })
}

export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  ENCRYPTION_ERROR: 'ENCRYPTION_ERROR',
  DECRYPTION_ERROR: 'DECRYPTION_ERROR',
  MFA_ERROR: 'MFA_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
} as const
