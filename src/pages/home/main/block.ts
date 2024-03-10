import EventBus from '../../../scripts/eventBus';

/**
 * интерфейс для свойств блока
 * @interface
 */
interface Block {
  _events: EventBus;
  _addEvents(events: { [event: string]: Function }): void;
  _removeEvents(): void;
}

/**
 * базовый класс блока событий
 * @class
 */
class Block {
  /**
   * конструктор класса Block
   * @constructor
   */
  constructor() {
    this._events = new EventBus();
  }

  /**
   * метод для добавления обработчиков событий
   * @param {Object} events - объект событий и их обработчиков
   */
  _addEvents(events: { [event: string]: Function }): void {
    for (const event in events) {
      if (events.hasOwnProperty(event)) {
        this._events.on(event, events[event].bind(this));
      }
    }
  }
  /**
   * метод для удаления обработчиков событий
   */
  _removeEvents() {
  }
}

export default Block;
