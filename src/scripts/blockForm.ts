import EventBus from './eventBus';

/**
 * интерфейс для свойств блока
 * @interface
 */
export interface BlockProps {
  events: { [event: string]: (event: Event) => void };
}

/**
 * класс блока
 * @class
 * @template T - тип события
 */
class Block<T extends Event = Event> {
  _events: EventBus<T>;
  _eventHandlers: { [event: string]: (event: Event) => void };
  element: HTMLElement | null;

  /**
   * конструктор класса Block
   * @constructor
   * @param {HTMLElement | null} element - эемент блока
   */
  constructor(element: HTMLElement | null) {
    this._events = new EventBus<T>();
    this._eventHandlers = {};
    this.element = element;
  }

  /**
   * добавляет обработчики событий к блоку
   * @param {Object} events - объект, содержащий обработчики событий
   */
  _addEvents(events: { [event: string]: (event: Event) => void }): void {
    if (!this.element) {
      console.error('element is undefined');
      return;
    }

    for (const event in events) {
      if (events.hasOwnProperty(event)) {
        const handler = events[event];
        this._eventHandlers[event] = handler;
        this._events.on(event, handler);
        this.element.addEventListener(event, handler);
      }
    }
  }

  /**
   * Удаляет обработчики событий блока.
   */
  _removeEvents(): void {
  }
}

export default Block;
