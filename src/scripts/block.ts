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
  }

  /**
   * добавляет обработчики событий к элементам блока
   */
  private _addEvents() {
    if (this._props.events) {
      Object.entries(this._props.events).forEach(([event, handler]) => {
        if (event === 'click') {
          const chatItems = this.element.querySelectorAll('li');
          chatItems.forEach((chatItem) => {
            chatItem.addEventListener(event, handler);
            console.log(`Event listener added for '${event}'`);
          });
        } else if (event === 'blur') {
          const inputs = this.element.querySelectorAll('input');
          inputs.forEach((input) => {
            input.addEventListener(event, handler);
          });
        } else if (event === 'beforeunload') {
          window.addEventListener(event, handler);
        } else {
          this.element.addEventListener(event, handler);
        }
      });
    }
  }

  /**
   * удаляет обработчики событий у элементов блока
   */
  private _removeEvents() {
    if (this._props.events) {
      Object.entries(this._props.events).forEach(([event, handler]) => {
        if (event === 'blur') {
          const inputs = this.element.querySelectorAll('input');
          inputs.forEach((input) => {
            input.removeEventListener(event, handler);
          });
        } else if (event === 'beforeunload') {
          window.removeEventListener(event, handler);
        } else {
          this.element.removeEventListener(event, handler);
        }
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
   * вызывает метод componentDidMount блока
   */
  private _componentDidMount() {
    this.componentDidMount();
    // this._addEvents();
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
   * метод componentDidMount блока
   * @param {BlockProps} [oldProps] - предыдущие свойства блока
   */
  protected componentDidMount(oldProps?: BlockProps) {
    oldProps;
  }

  /**
   * вызывает событие FLOW_CDM
   */
  protected dispatchComponentDidMount() {
    this.eventBus.emit(Block.EVENTS.FLOW_CDM);
  }

  /**
   * устанавливает новые свойства блока
   * @param {BlockProps} nextProps - новые свойства
   */
  setProps = (nextProps: T) => {
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
    this._addEvents();
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

  /* eslint-disable */
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
