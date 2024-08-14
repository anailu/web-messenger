import {expect} from 'chai';
import Route from './route';

/**
 * Класс для имитации класса Block
 */
class MockBlock {
  private _content: HTMLElement;
  /**
   * Конструктор
   */
  constructor() {
    this._content = document.createElement('div');
  }

  /**
   * Возвращает содержимое элемента
   * @return {HTMLElement} - Содержимое элемента
   */
  getContent(): HTMLElement {
    return this._content;
  }

  /**
   * Показывает компонент
   */
  show(): void {
    this._content.style.display = 'block';
  }

  /**
   * Скрывает компонент
   */
  hide(): void {
    this._content.style.display = 'none';
  }
}

/**
 * Создает экземпляр маршрута.
 *
 * @param {string} pathname - Путь маршрута.
 * @param {Object} [props={}] - Дополнительные свойства маршрута.
 * @param {*} [beforeEnter=null] - Функция, вызываемая перед входом в маршрут.
 * @return {Route} Экземпляр маршрута.
 */
function createRoute(
    pathname: string,
    props: any = {},
    beforeEnter: (() => Promise<void>) | null = null): Route {
  document.body.innerHTML = '<div id="app"></div>';
  return new Route(pathname, MockBlock, {rootQuery: '#app', ...props}, beforeEnter);
}

describe('Route', () => {
  it('создает экземпляр Route', () => {
    const route = createRoute('/test');
    expect(route).to.be.an.instanceof(Route);
  });

  it('сравнивает путь с помощью match', () => {
    const route = createRoute('/test');
    expect(route.match('/test')).to.be.true;
    expect(route.match('/other')).to.be.false;
  });

  it('переключает отображение с помощью navigate', async () => {
    const route = createRoute('/test');
    await route.render();
    expect(route.match('/test')).to.be.true;

    route.navigate('/test');
    const content = document.querySelector('#app div') as HTMLElement;

    expect(content).to.exist;
    expect(content.style.display).to.equal('block');

    route.navigate('/other');
    expect(route.match('/other')).to.be.false;
  });

  it('скрывает блок с помощью leave', async () => {
    const route = createRoute('/test');
    await route.render();
    route.leave();
    const content = document.querySelector('#app div') as HTMLElement;
    expect(content!.style.display).to.equal('none');
  });

  it('рендерит блок с помощью render', async () => {
    const route = createRoute('/test');
    await route.render();
    const content = document.querySelector('#app div');
    expect(content).to.exist;
  });
});
