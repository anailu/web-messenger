import Block from '../core/block';

interface ErrorLineProps {
  error: string;
}
/**
 * Компонент строки ошибки
 * @extends Block
 */
class ErrorLine extends Block {
  /**
   * Создает элемент-ошибку ErrorLine
   * @param {ListCardProps} props - ErrorLineProps
   */
  constructor(props: ErrorLineProps) {
    super(props);
  }

  /**
   * Рендеринг HTML для компонента
   * @return {string} - HTML строка
   */
  render(): string {
    return (`
      <div class="input__text-error"> ${this.props.error}</div>
    `);
  }
}

export default ErrorLine;
