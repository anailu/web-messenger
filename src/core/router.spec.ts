import Router from './router';
import {expect} from 'chai';

/**
 * Создает новый экземпляр Router
 * @param {string} [rootQuery='#app'] - CSS-селектор для элемента, куда рендерятся страницы
 * @return {Router} Экземпляр Router.
 */
function createRouter(rootQuery: string = '#app'): Router {
  return new Router(rootQuery);
}

describe('Router', () => {
  let router: Router;

  beforeEach(() => {
    router = createRouter();
    router.use('*', () => {}, null);
  });

  it('создает экзмепляр Router', () => {
    expect(router).to.be.an.instanceof(Router);
  });

  it('возвращает тот же экземпляр при многократном вызове', () => {
    const anotherRouter = createRouter();
    expect(router).to.equal(anotherRouter);
  });

  it('добавляет новый маршрут, используя метод use', () => {
    const routeCallback = () => {};
    router.use('/test', routeCallback);
    const route = router.getRoute('/test');
    expect(route).to.exist;
  });

  it('изменяет маршрут, используя метод go', () => {
    router.use('/test', () => {});
    router.go('/test');
    expect(router['_currentRoute']).to.exist;
    expect(router['_currentRoute']!.pathname).to.equal('/test');
  });

  it('возвращает корректный маршрут, используя getRoute', () => {
    router.use('/test', () => {});
    const route = router.getRoute('/test');
    expect(route).to.exist;
    expect(route!.pathname).to.equal('/test');
  });

  it('возвращает 404 для несуществующего маршрута', () => {
    const route = router.getRoute('/non-existent');
    expect(route).to.exist;
    expect(route!.pathname).to.equal('*');
  });

  it('возвращает назад используя метод back', (done) => {
    router.use('/test', () => {});
    router.use('/', () => {});

    router.go('/test');
    router.go('/');

    router.back();

    setTimeout(() => {
      expect(router['_currentRoute']!.pathname).to.equal('/test');
      done();
    }, 100);
  });

  it('переходит вперед используя forward метод', (done) => {
    router.use('/test', () => {});
    router.use('/', () => {});

    router.go('/test');
    router.back();

    router.forward();

    setTimeout(() => {
      expect(router['_currentRoute']!.pathname).to.equal('/test');
      done();
    }, 100);
  });
});
