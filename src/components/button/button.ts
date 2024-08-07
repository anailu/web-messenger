import Block from '../../core/block';

interface ButtonProps {
  type?: string;
  label?: string;
  onClick?: (event: Event) => void;
}

/**
 * Компонент кнопки
 * @extends Block
 */
class Button extends Block {
  /**
   * Конструктор компонента
   * @param {InputElementProps} props - Пропсы для компонента
   */
  constructor(props: ButtonProps) {
    super({
      ...props,
      events: {
        click: props.onClick,
      },
    });
  }

  /**
   * Рендеринг HTML для компонента
   * @return {string} - HTML строка
   */
  render(): string {
    return `
        <button class="button button__{{type}}" >
            {{label}}
        </button>
    `;
  }
}

export default Button;
