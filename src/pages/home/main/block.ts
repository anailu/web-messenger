/**
 * блочный элемент
 */
export class Block {
  private element: HTMLElement;

  /**
   * конструктор для нового Block
   * @param {string} [tagName='div'] - имя HTML-тега элемента
   */
  constructor(tagName: string = 'div') {
    this.element = document.createElement(tagName);
  }

  /**
   * рендер контента внутри блока
   * @param {string} content - контент для отображения
   */
  render(content: string): void {
    this.element.innerHTML = content;
  }

  /**
   * базовый HTMLElement блока
   * @return {HTMLElement} базовый HTMLElement
   */
  getElement(): HTMLElement {
    return this.element;
  }
}
