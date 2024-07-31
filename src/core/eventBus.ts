/**
 * Класс для работы с событиями и слушателями
 * @template E - Тип для событий
 */
export default class EventBus<E extends string> {
  listeners: {[key in E]?: Function[]} = {};

  /**
    * регистрирует обработчик события
    * @param {string} event - имя события
    * @param {Callback} callback - функция-обработчик события
    */
  on<F extends(...args: Parameters<F>) => void>(event: E, callback: F) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(callback);
  }

  /**
    * удаляет обработчик события
    * @param {string} event - имя события
    * @param {Callback} callback - функция-обработчик события
    */
  off<F extends(...args: any) => void>(event: E, callback: F) {
    if (!this.listeners[event]) {
      throw new Error(`Нет события: ${event}`);
    }
    this.listeners[event] = this.listeners[event]!.filter((listener) => listener !== callback);
  }

  /**
    * генерирует событие и вызывает его обработчики
    * @param {string} event - имя события
    * @param {any} [data] - дополнительные данные для передачи обработчикам события
    */
  emit<F extends(...args: any) => void>(event: E, ...args: Parameters<F>) {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event]!.forEach(function(listener) {
      listener(...args);
    });
  }
}
