import Route from './route';

/**
 * Класс для управления маршрутизацией в приложении.
 */
class Router {
  private static __instance: Router | null = null;
  private routes: Route[] = [];
  private history: History = window.history;
  private _currentRoute: Route | null = null;
  private _rootQuery!: string;

  /**
   * Создает экземпляр Router.
   * @param {string} rootQuery - Корневой селектор для рендеринга маршрутов.
   */
  constructor(rootQuery: string) {
    if (Router.__instance) {
      return Router.__instance;
    }

    this.routes = [];
    this.history = window.history;
    this._currentRoute = null;
    this._rootQuery = rootQuery;

    Router.__instance = this;
  }

  /**
   * Добавляет маршрут в роутер.
   * @param {string} pathname - Путь маршрута.
   * @param {any} block - Компонент блока для данного маршрута.
   * @param {*} beforeEnter - Функция, вызываемая перед входом в маршрут.
   * @return {Router} Экземпляр роутера.
   */
  use(pathname: string, block: any, beforeEnter: (() => Promise<void>) | null = null): Router {
    const route = new Route(pathname, block, {rootQuery: this._rootQuery}, beforeEnter);
    this.routes.push(route);
    return this;
  }

  /**
   * Запускает роутер и обрабатывает навигацию.
   */
  start(): void {
    window.onpopstate = (event: PopStateEvent) => {
      const target = event.currentTarget as Window | null;
      if (target) {
        this._onRoute(target.location.pathname);
      }
    };

    this._onRoute(window.location.pathname);
  }

  /**
   * Обрабатывает смену маршрута.
   * @param {string} pathname - Путь маршрута.
   * @return {Promise<void>}
   */
  private async _onRoute(pathname: string): Promise<void> {
    const route = this.getRoute(pathname);

    if (!route) {
      return;
    }

    if (this._currentRoute && this._currentRoute !== route) {
      this._currentRoute.leave();
    }

    this._currentRoute = route;

    await route.render();
  }

  /**
   * Перенаправляет на указанный маршрут.
   * @param {string} pathname - Путь маршрута.
   */
  go(pathname: string): void {
    this.history.pushState({}, '', pathname);
    this._onRoute(pathname);
  }

  /**
   * Возвращает на предыдущий маршрут в истории.
   */
  back(): void {
    window.addEventListener('popstate', () => this._onRoute(window.location.pathname), {
      once: true,
    });

    this.history.back();
  }

  /**
   * Перенаправляет на следующий маршрут в истории.
   */
  forward(): void {
    window.addEventListener('popstate', () => this._onRoute(window.location.pathname), {
      once: true,
    });

    this.history.forward();
  }

  /**
   * Находит маршрут по пути.
   * @param {string} pathname - Путь маршрута.
   * @return {Route | undefined} Найденный маршрут или undefined, если маршрут не найден.
   */
  getRoute(pathname: string): Route | undefined {
    const route = this.routes.find((route) => route.match(pathname));
    if (!route) {
      return this.routes.find((route) => route.match('*'));
    }

    return route;
  }
}

export default Router;
