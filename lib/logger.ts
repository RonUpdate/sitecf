// Типы для логов
export type LogLevel = "debug" | "info" | "warn" | "error"

export type LogEntry = {
  timestamp: string
  level: LogLevel
  message: string
  context?: any
}

// Хранилище логов в памяти
const logs: LogEntry[] = []
const MAX_LOGS = 1000

// Базовая функция логирования
function log(level: LogLevel, message: string, context?: any): void {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    context,
  }

  logs.unshift(entry) // Добавляем в начало массива для хронологического порядка

  // Ограничиваем количество логов
  if (logs.length > MAX_LOGS) {
    logs.pop()
  }

  // В разработке выводим в консоль
  if (process.env.NODE_ENV === "development") {
    console[level](message, context)
  }
}

// Функции для разных уровней логирования
function logDebug(message: string, context?: any): void {
  log("debug", message, context)
}

function logInfo(message: string, context?: any): void {
  log("info", message, context)
}

function logWarn(message: string, context?: any): void {
  log("warn", message, context)
}

function logError(message: string, error?: any, context?: any): void {
  log("error", message, { error, ...context })
}

// Функция для получения логов
function getLogs(level?: LogLevel): LogEntry[] {
  if (!level) return [...logs]
  return logs.filter((entry) => entry.level === level)
}

// Функция для очистки логов
function clearLogs(): void {
  logs.length = 0
}

// Функция для экспорта логов в JSON
function exportToJSON(level?: LogLevel): string {
  const logsToExport = level ? getLogs(level) : getLogs()
  return JSON.stringify(logsToExport, null, 2)
}

// Функция для экспорта логов в CSV
function exportToCSV(level?: LogLevel): string {
  const logsToExport = level ? getLogs(level) : getLogs()

  // Заголовок CSV
  let csv = "timestamp,level,message,context\n"

  // Добавляем каждую запись
  logsToExport.forEach((log) => {
    // Экранируем поля, содержащие запятые, кавычки или переносы строк
    const timestamp = escapeCsvField(log.timestamp)
    const level = escapeCsvField(log.level)
    const message = escapeCsvField(log.message)
    const context = log.context ? escapeCsvField(JSON.stringify(log.context)) : ""

    csv += `${timestamp},${level},${message},${context}\n`
  })

  return csv
}

// Вспомогательная функция для экранирования полей CSV
function escapeCsvField(field: string): string {
  // Если поле содержит запятые, кавычки или переносы строк, заключаем его в кавычки
  if (field.includes(",") || field.includes('"') || field.includes("\n")) {
    // Экранируем кавычки, дублируя их
    return `"${field.replace(/"/g, '""')}"`
  }
  return field
}

// Специализированные функции для логирования аутентификации
const auth = {
  debug: (message: string, context?: any) => logDebug(`[Auth] ${message}`, context),
  info: (message: string, context?: any) => logInfo(`[Auth] ${message}`, context),
  warn: (message: string, context?: any) => logWarn(`[Auth] ${message}`, context),
  error: (message: string, error?: any, context?: any) => logError(`[Auth] ${message}`, error, context),
  event: (message: string, context?: any) => logInfo(`[Auth] ${message}`, context),
}

// Экспортируем функции
const logger = {
  debug: logDebug,
  info: logInfo,
  warn: logWarn,
  error: logError,
  getLogs,
  clearLogs,
  auth,
  export: {
    toJSON: exportToJSON,
    toCSV: exportToCSV,
  },
}

export default logger
