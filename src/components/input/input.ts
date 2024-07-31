import Block from '../../core/block';

interface InputProps {
  input_class?: string;
  placeholder?: string;
  value?: string;
  type?: string;
  id?: string;
  events?: { [key: string]: (event: Event) => void };
  name?: string;
}

/**
 * Компонент поля ввода
 * @extends Block
 */
class Input extends Block {
  props: InputProps;

  /**
   * Конструктор компонента
   * @param {InputElementProps} props - Пропсы для компонента
   */
  constructor(props: InputProps) {
    super(props);
    this.props = props;
  }

  /**
   * Получение значения поля ввода
   * @return {string} - Значение поля ввода
   * @throws {Error} - Если элемент ввода не найден
   */
  getValue(): string {
    const element = this.element as HTMLElement | null;
    if (!element) {
      throw new Error('Element is not available');
    }

    const inputElement = element.querySelector('input') as HTMLInputElement | null;
    if (!inputElement) {
      throw new Error('Input element not found');
    }
    return inputElement.value;
  }

  /**
   * Рендеринг HTML для компонента
   * @return {string} - HTML строка
   */
  render(): string {
    return `
      <input
        type="${this.props.type || 'text'}"
        class="{{input_class}}"
        placeholder="{{placeholder}}"
        value="${this.props.value || ''}"
        id="{{id}}"
        name="${this.props.name || ''}"
      />
    `;
  }
}

export default Input;
