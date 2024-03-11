/**
 * отправляет данные формы в консоль
 *
 * @param {Object.<string, string>} formData - Объект с данными формы,
 * где ключи - имена полей, значения - соответствующие значения полей
 * @return {void}
 */
export function sendDataToConsole(formData: { [key: string]: string }): void {
  console.log('Form Data:', formData);
}
