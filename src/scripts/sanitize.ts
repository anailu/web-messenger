/**
 * Санитайзинг данных формы.
 * Удаляет скрипты.
 * @param {Object} data - Данные формы.
 * @return {Object} - Санитизированные данные.
 */
export function sanitizeFormData(data: any): any {
  const sanitized = {...data};
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitized[key].replace(/<script.*?>.*?<\/script>/gi, '');
    }
  }
  return sanitized;
}

/**
 * Санитизирует строку сообщения.
 * Удаляет небезопасные символы и экранирует специальные символы.
 * @param {string} message - Сообщение для санитизации.
 * @return {string} - Санитизированное сообщение.
 */
export function sanitizeMessage(message: string): string {
  return message
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
}
