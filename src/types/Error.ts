export interface CustomError extends Error {
  customCode?: number
  statusCode?: number
  code?: string
  details?: string
  hint?: string
}
