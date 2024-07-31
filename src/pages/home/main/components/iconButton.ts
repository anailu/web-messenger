import Block from '../../../../core/block';

interface IconButtonProps {
  icon: string;
  modal: Block;
}

/**
 * Компонент кнопки с иконкой.
 * При нажатии на кнопку отображается переданное модальное окно.
 * @extends Block
 */
class IconButton extends Block {
  /**
   * Создает экземпляр IconButton.
   * @param {IconButtonProps} props - Свойства кнопки
   */
  constructor(props: IconButtonProps) {
    super({
      ...props,
      events: {
        click: () => {
          props.modal.show();
        },
      },
    });
  }

  /**
   * Рендерит кнопку с иконкой.
   * @return {string} HTML разметка кнопки
   */
  render(): string {
    return `
      <button class="icon_button">
        <img src="${this.props.icon}" alt="icon">
      </button>
    `;
  }
}

export default IconButton;
