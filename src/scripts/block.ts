import {EventBus} from './eventBus';

type EventCallback = (...args: any[]) => void;

export interface BlockProps {
  events: { [key: string]: EventCallback };
}

/**
 * базовый класс для создания блоков
 * @template T - тип свойств блока
 */
abstract class Block<T extends BlockProps = BlockProps> {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_RENDER: 'flow:render',
  };

  private _element: HTMLElement | null = null;
  private _meta: { tagName: string; props: T } | null = null;
  private _props: T;
  eventBus: EventBus;

  /**
   * конструктор класса Block
   * @param {string} tagName - имя тега HTML для создания элемента блока
   * @param {T} props - свойства блока
   */
  constructor(tagName: string, props: T) {
    const eventBus = new EventBus();

    this._meta = {
      tagName,
      props,
    };

    this._props = this._makePropsProxy(props, (newProps) => {
      this._props = {...this._props, ...newProps};
      this._removeEvents();
      this._addEvents();
      eventBus.emit(Block.EVENTS.FLOW_RENDER);
    }) as T;

    this.eventBus = eventBus;

    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT);
  }

  /**
   * регистрирует обработчики событий
   * @param {EventBus} eventBus - шина событий
   */
  private _registerEvents(eventBus: EventBus) {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
    this._addEvents();
  }

  /**
   * добавляет обработчики событий к элементам блока
   */
  private _addEvents() {
    const {events} = this._props;
    if (events) {
      Object.keys(events).forEach((eventName) => {
        const eventCallback = events[eventName] as EventCallback;
        this.eventBus.on(eventName, eventCallback);
      });
    }
  }

  /**
   * метод для размонтирования блока
   */
  protected componentWillUnmount() {
    this._removeEvents();
  }

  /**
   * удаляет обработчики событий у элементов блока
   */
  private _removeEvents() {
    const {events} = this._props;
    if (events) {
      Object.keys(events).forEach((eventName) => {
        const eventCallback = events[eventName] as EventCallback;
        this.eventBus.off(eventName, eventCallback);
      });
    }
  }

  /**
   * создает ресурсы блока
   */
  private _createResources() {
    const {tagName} = this._meta!;
    this._element = this._createDocumentElement(tagName);
  }

  /**
   * иициализирует блок
   */
  private init() {
    this._createResources();
    this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
  }

  /**
   * вызывает метод componentDidMount блока
   */
  private _componentDidMount() {
    this.componentDidMount();
  }

  /* eslint-disable */
  /**
   * метод componentDidMount блока
   * @param {BlockProps} [oldProps] - предыдущие свойства блока
   */
  protected componentDidMount(oldProps?: BlockProps) {
    /* eslint no-unused-vars: 0 */
  }

  /**
   * вызывает событие FLOW_CDM
   */
  protected dispatchComponentDidMount() {
    this.eventBus.emit(Block.EVENTS.FLOW_CDM);
  }

  /**
   * вызывает метод componentDidUpdate блока
   */
  private _componentDidUpdate(oldProps: BlockProps, newProps: BlockProps) {
  }

  /**
   * метод componentDidUpdate блока
   */
  protected componentDidUpdate(oldProps: BlockProps, newProps: BlockProps): boolean {
    return true;
  }

  /**
   * устанавливает новые свойства блока
   * @param {BlockProps} nextProps - новые свойства
   */
  setProps = (nextProps: BlockProps) => {
    if (!nextProps) {
      return;
    }

    Object.assign(this._props, nextProps);
  };

  /**
   * возвращает элемент блока
   */
  get element() {
    return this._element!;
  }

  /**
   * рендерит блок
   */
  private _render() {
    const block = this.render();
    this._element!.innerHTML = block;
  }

  /**
   * метод рендеринга блока
   * @return {string} - HTML-код блока
   */
  protected render(): string {
    return '';
  }

  /**
   * возвращает содержимое блока
   * @return {HTMLElement} - содержимое блока
   */
  getContent() {
    return this.element;
  }

  /**
   * создает прокси для свойств блока
   * @param {BlockProps} props - свойства блока
   * @param {(newProps: BlockProps): void} onChange - функция обратного вызова при изменении свойств
   * @returns {BlockProps} - прокси для свойств блока
   */
  private _makePropsProxy(props: BlockProps, onChange: (newProps: BlockProps) => void) {
    const propsProxy = new Proxy(props, {
      set(target, prop, value) {
        target[prop as keyof BlockProps] = value;
        onChange(target);
        return true;
      },
    });

    return propsProxy;
  }
  /* eslint-enable */

  /**
   * создает DOM-элемент блока
   * @param {string} tagName - имя тега HTML
   * @return {HTMLElement} - DOM-элемент блока
   */
  private _createDocumentElement(tagName: string): HTMLElement {
    return document.createElement(tagName);
  }

  /**
   * отображает блок
   */
  show() {
    this.getContent().style.display = 'block';
  }

  /**
   * скрывает блок
   */
  hide() {
    this.getContent().style.display = 'none';
  }
}

export default Block;
