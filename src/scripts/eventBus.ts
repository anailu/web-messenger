/**
 * Интерфейс для обработчиков событий
 * @interface
 */
interface EventListeners<T> {
  [event: string]: ((data: T) => void)[];
}

/**
 * класс управления событиями
 */
export default class EventBus<T> {
  private listeners: EventListeners<T>;

  /**
   * Конструктор класса EventBus
   * @constructor
   */
  constructor() {
    this.listeners = {};
  }

  /**
   * регистрирует обработчик события
   * @param {string} event - имя события
   * @param {Callback} callback - функция-обработчик события
   */
  on(event: string, callback: (data: T) => void): void {
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
  off(event: string, callback: (data: T) => void): void {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((listener) => listener !== callback);
    }
  }

  /**
   * генерирует событие и вызывает его обработчики
   * @param {string} event - имя события
   * @param {any} [data] - дополнительные данные для передачи обработчикам события
   */
  emit(event: string, data: T): void {
    if (this.listeners[event]) {
      this.listeners[event].forEach((listener) => listener(data));
    }
  }
}
