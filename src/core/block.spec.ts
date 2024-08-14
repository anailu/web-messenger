import {expect} from 'chai';
import sinon from 'sinon';
import Block from './block';

interface TestBlockProps {
  title: string;
  events?: Record<string, (event: Event) => void>;
}

/**
 * тестовый класс
 */
class TestBlock extends Block<TestBlockProps> {
  /**
   * метод рендера разметки
   * @return {string} - HTML-разметка
   */
  render(): string {
    return `<div>${this.props.title}</div>`;
  }
}

describe('Block', () => {
  let block: TestBlock;

  beforeEach(() => {
    block = new TestBlock({title: 'test title'});
  });

  it('должен создать элемент', () => {
    block._createResources();
    expect(block.element).to.be.instanceOf(global.window.HTMLElement);
  });

  it('должен корректно рендерить', () => {
    block._createResources();
    block._render();
    expect(block.element?.innerHTML).to.equal('test title');
  });

  it('должен обновлять props и вызывать componentDidUpdate', () => {
    const spy = sinon.spy(block, 'componentDidUpdate');
    block.setProps({title: 'new title'});
    expect(block.props.title).to.equal('new title');
    expect(spy.calledOnce).to.be.true;
  });

  it('должен вызывать componentDidMount при вызове dispatchComponentDidMount', () => {
    const spy = sinon.spy(block, 'componentDidMount');
    block.dispatchComponentDidMount();
    expect(spy.calledOnce).to.be.true;
  });

  it('должен корректно добавлять события', () => {
    const clickSpy = sinon.spy();
    const blockWithEvent = new TestBlock({title: 'test title', events: {click: clickSpy}});
    blockWithEvent._createResources();
    blockWithEvent._render();
    blockWithEvent.element?.click();
    expect(clickSpy.calledOnce).to.be.true;
  });

  it('должен корректно показываться и скрываться', () => {
    block._createResources();
    block._render();
    block.show();
    expect(block.element?.style.display).to.equal('flex');
    block.hide();
    expect(block.element?.style.display).to.equal('none');
  });
});
