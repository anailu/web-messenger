import Block from '../core/block';

interface EditButtonProps {
  text: string;
  modal: any;
  events?: {
    click?: (event: MouseEvent) => void;
  };
}

/**
 * Компонент кнопки
 * @extends Block
 */
class EditButton extends Block {
  props: EditButtonProps;

  /**
   * Конструктор компонента
   * @param {EditButtonProps} props - Пропсы компонента
   */
  constructor(props: EditButtonProps) {
    super(props);
    this.props = props;

    this.setProps({
      ...props,
      events: {
        click: this.onClick.bind(this),
      },
    });
  }

  /**
   * Обработчик события клика по кнопке
   * Выполняет показ модального окна
   */
  onClick() {
    if (this.props.modal) {
      this.props.modal.show();
    }
  }

  /**
   * Рендерит HTML для компонента
   * @return {string} - HTML строка
   */
  render() {
    return `
      <button class="edit-link">${this.props.text}</button>
    `;
  }
}

export default EditButton;
