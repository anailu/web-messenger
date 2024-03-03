type Callback = (data?: any) => void;

/**
 * класс управления событиями
 */
export class EventBus {
  private listeners: { [eventName: string]: Callback[] } = {};

  /**
   * регистрирует обработчик события
   * @param {string} eventName - имя события
   * @param {Callback} callback - функция-обработчик события
   */
  on(eventName: string, callback: Callback): void {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }

    this.listeners[eventName].push(callback);
  }

  /**
   * удаляет обработчик события
   * @param {string} eventName - имя события
   * @param {Callback} callback - функция-обработчик события
   */
  off(eventName: string, callback: Callback): void {
    const eventListeners = this.listeners[eventName];

    if (eventListeners) {
      this.listeners[eventName] = eventListeners.filter((listener) => listener !== callback);
    }
  }

  /**
   * генерирует событие и вызывает его обработчики
   * @param {string} eventName - имя события
   * @param {any} [data] - дополнительные данные для передачи обработчикам события
   */
  emit(eventName: string, data?: any): void {
    const eventListeners = this.listeners[eventName];

    if (eventListeners) {
      eventListeners.forEach((listener) => listener(data));
    }
  }
}
