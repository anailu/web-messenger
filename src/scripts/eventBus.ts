export type EventCallback = (...args: any[]) => void;
/**
 * класс управления событиями
 */
export class EventBus {
  private listeners: Record<string, EventCallback[]> = {};

  /**
   * регистрирует обработчик события
   * @param {string} event - имя события
   * @param {Callback} callback - функция-обработчик события
   */
  on(event: string, callback: EventCallback): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(callback);
  }

  /**
   * удаляет обработчик события
   * @param {string} event - имя события
   * @param {Callback} callback - функция-обработчик события
   */
  off(event: string, callback: EventCallback): void {
    if (!this.listeners[event]) {
      throw new Error(`Нет события: ${event}`);
    }

    this.listeners[event] = this.listeners[event].filter(
        (listener) => listener !== callback
    );
  }

  /**
   * генерирует событие и вызывает его обработчики
   * @param {string} event - имя события
   * @param {any} [data] - дополнительные данные для передачи обработчикам события
   */
  emit(event: string, ...args: any[]): void {
    if (!this.listeners[event]) {
      throw new Error(`Нет события: ${event}`);
    }

    this.listeners[event].forEach((listener) => {
      listener(...args);
    });
  }
}
