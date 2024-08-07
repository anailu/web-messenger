import EventBus from './eventBus';
import {nanoid} from 'nanoid';
import Handlebars from 'handlebars';

type Values<T> = T[keyof T];
type TEvents = Values<typeof Block.EVENTS>

/**
 * Класс для создания и управления компонентами
 * @template P - Тип пропсов компонента
 */
export default class Block<P extends Record<string, any> = any> {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render',
  } as const;

  _element: HTMLElement | null = null;
  _meta: { tagName: string, props: P } | null = null;
  _id: string = nanoid(6);

  private _eventbus: EventBus<TEvents>;

  props: P;
  children: Record<string, Block<any>>;

  /**
   * Конструктор компонента
   * @param {P} propsWithChildren - Пропсы и дочерние компоненты
   */
  constructor(propsWithChildren: P = {} as P) {
    const eventBus = new EventBus<TEvents>();
    const {props, children} = this._getChildrenAndProps(propsWithChildren);
    this.props = this._makePropsProxy({...props});
    this.children = children;

    this._eventbus = eventBus;
    this._registerEvents(eventBus);

    eventBus.emit(Block.EVENTS.INIT);
  }

  /**
   * Добавляет обработчики событий
   */
  _addEvents() {
    const {events = {}} = this.props;
    Object.keys(events).forEach((eventName) => {
      this._element?.addEventListener(eventName, events[eventName]);
    });
  }

  /**
   * Регистрирует события в EventBus
   * @param {EventBus<TEvents>} eventBus - Экземпляр EventBus
   */
  _registerEvents(eventBus: EventBus<TEvents>) {
    eventBus.on(Block.EVENTS.INIT, this._init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  /**
   * Создает необходимые ресурсы для компонента
   */
  _createResources() {
    if (this._meta) {
      const {tagName} = this._meta;
      this._element = this._createDocumentElement(tagName);
    }
  }

  /**
   * Инициализация компонента
   */
  _init() {
    this.init();
    this._eventbus.emit(Block.EVENTS.FLOW_RENDER);
  }

  /**
   * Метод для переопределения в дочерних классах
   */
  init() {}

  /**
   * Компонент монтируется в DOM
   */
  _componentDidMount() {
    this.componentDidMount();
    Object.values(this.children).forEach((child) => {
      child.dispatchComponentDidMount();
    });
  }

  /**
   * Метод для переопределения в дочерних классах
   */
  componentDidMount() {}

  /**
   * Запускает событие componentDidMount у дочерних компонентов
   */
  dispatchComponentDidMount() {
    this._eventbus.emit(Block.EVENTS.FLOW_CDM);
  }

  /**
   * Обрабатывает обновление пропсов
   * @param {P} oldProps - Старые пропсы
   * @param {P} newProps - Новые пропсы
   */
  _componentDidUpdate(oldProps: P, newProps: P) {
    const response = this.componentDidUpdate(oldProps, newProps);
    if (!response) return;
    this._render();
  }

  /**
   * Метод для переопределения в дочерних классах
   * @param {P} oldProps - Старые пропсы
   * @param {P} newProps - Новые пропсы
   * @return {boolean} - Нужно ли перерендеривать компонент
   */
  componentDidUpdate(oldProps: P, newProps: P): boolean {
    if (oldProps) {
      console.log(oldProps, newProps);
    }

    return true;
  }

  /**
   * Разделяет пропсы и дочерние компоненты
   * @param {P} propsAndChildren - Пропсы и дочерние компоненты
   * @return {{children: Record<string, Block<any>>, props: P}} - пропсы и дочерние компоненты
   */
  _getChildrenAndProps(propsAndChildren: P) {
    const children: Record<string, Block<any>> = {};
    const props: P = {} as P;

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (value instanceof Block) {
        children[key] = value;
      } else {
        (props as any)[key] = value;
      }
    });

    return {children, props};
  }

  /**
   * Устанавливает новые пропсы
   * @param {P} nextProps - Новые пропсы
   */
  setProps = (nextProps: P) => {
    if (!nextProps) return;
    Object.assign(this.props, nextProps);
  };

  /**
   * Возвращает элемент компонента
   * @return {HTMLElement | null} - Элемент компонента
   */
  get element() {
    return this._element;
  }

  /**
   * Рендерит компонент в DOM
   */
  _render() {
    const propsAndStubs: Record<string, any> = {...this.props};

    Object.entries(this.children).forEach(([key, child]) => {
      propsAndStubs[key] = `<div data-id="${child._id}"></div>`;
    });

    const childrenProps: Block<any>[] = [];
    Object.entries(propsAndStubs).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        propsAndStubs[key] = value.map((item) => {
          if (item instanceof Block) {
            childrenProps.push(item);
            return `<div data-id="${item._id}"></div>`;
          }
          return item;
        }).join('');
      }
    });

    const fragment = this._createDocumentElement('template') as HTMLTemplateElement;
    fragment.innerHTML = Handlebars.compile(this.render())(propsAndStubs);
    const newElement = fragment.content.firstElementChild as HTMLElement | null;

    [...Object.values(this.children), ...childrenProps].forEach((child) => {
      const stub = fragment.content.querySelector(`[data-id="${child._id}"]`);
      if (stub && child.getContent()) {
        stub.replaceWith(child.getContent() as Node);
      }
    });

    if (this._element && newElement) {
      newElement.style.display = this._element.style.display;
      this._element.replaceWith(newElement);
    }

    this._element = newElement;
    this._addEvents();
  }

  /**
   * Метод для переопределения в дочерних классах
   * @return {string} - HTML представление компонента
   */
  render(): string {
    return '';
  }

  /**
   * Возвращает содержимое элемента
   * @return {HTMLElement | null} - Содержимое элемента
   */
  getContent(): HTMLElement | null {
    if (this.element?.parentNode?.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      setTimeout(() => {
        if (this.element?.parentNode?.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
          this.dispatchComponentDidMount();
        }
      }, 100);
    }
    return this.element;
  }

  /**
   * Создает прокси для пропсов компонента
   * @param {P} props - Пропсы компонента
   * @return {Proxy} - Прокси для пропсов
   */
  _makePropsProxy(props: P) {
    const self = this;
    return new Proxy(props, {
      get(target: P, prop: string | symbol) {
        const value = target[prop as keyof P];
        return typeof value === 'function' ? value.bind(target) : value;
      },
      set(target: P, prop: string | symbol, value: any) {
        const oldTarget = {...target};
        target[prop as keyof P] = value;
        self._eventbus.emit(Block.EVENTS.FLOW_CDU, oldTarget, target);
        return true;
      },
      deleteProperty() {
        throw new Error('Нет доступа');
      },
    });
  }

  /**
   * Создает новый элемент документа
   * @param {string} tagName - Название тега
   * @return {HTMLElement} - Новый элемент документа
   */
  _createDocumentElement(tagName: string): HTMLElement {
    return document.createElement(tagName);
  }

  /**
   * Показывает компонент
   */
  show() {
    const content = this.getContent();
    if (content) {
      content.style.display = 'flex';
    }
  }

  /**
   * Скрывает компонент
   */
  hide() {
    const content = this.getContent();
    if (content) {
      content.style.display = 'none';
    }
  }
}
