interface Block {
  getContent(): HTMLElement;
  show(): void;
  hide(): void;
}

interface RouteProps {
  rootQuery: string;
  [key: string]: any;
}

/**
 * Класс для представления маршрута в приложении
 */
class Route {
  private _pathname: string;
  private _blockClass: new (props: any) => Block;
  private _block: Block | null;
  private _props: RouteProps;
  private _beforeEnter: (() => Promise<void>) | null;

  /**
   * Создает новый маршрут
   * @param {string} pathname - Путь маршрута
   * @param {any} view - Класс блока для рендеринга
   * @param {any} props - Свойства маршрута
   * @param {*} beforeEnter - Функция, которая вызывается перед рендерингом маршрута
   */
  constructor(
      pathname: string,
      view: new (props: any) => Block,
      props: RouteProps, beforeEnter: (() => Promise<void>) | null = null
  ) {
    this._pathname = pathname;
    this._blockClass = view;
    this._block = null;
    this._props = props;
    this._beforeEnter = beforeEnter;
  }

  /**
   * Обновляет путь маршрута и перерисовывает блок, если путь совпадает
   * @param {string} pathname - Новый путь маршрута
   */
  navigate(pathname: string): void {
    if (this.match(pathname)) {
      this._pathname = pathname;
      this.render();
    }
  }

  /**
   * Скрывает текущий блок
   */
  leave(): void {
    if (this._block) {
      this._block.hide();
    }
  }

  /**
   * Проверяет, совпадает ли путь с маршрутом
   * @param {string} pathname - Путь для проверки
   * @return {boolean} - Результат проверки
   */
  match(pathname: string): boolean {
    return pathname === this._pathname;
  }

  /**
   * Возвращает текущий путь маршрута.
   * @return {string} Текущий путь маршрута.
   */
  get pathname(): string {
    return this._pathname;
  }

  /**
   * Рендерит блок в корневой элемент
   * @param {string} query - CSS-селектор для корневого элемента
   * @param {any} block - Блок для рендеринга
   */
  _renderDom(query: string, block: any): void {
    const root = document.querySelector(query);
    if (root) {
      root.append(block.getContent());
    }
  }

  /**
   * Рендерит блок маршрута и вызывает функцию beforeEnter, если она задана
   * @return {Promise<void>}
   */
  async render(): Promise<void> {
    if (this._beforeEnter) {
      await this._beforeEnter();
    }

    if (!this._block) {
      this._block = new this._blockClass({});
      this._renderDom(this._props.rootQuery, this._block);
      return;
    }

    this._block.show();
  }
}

export default Route;
