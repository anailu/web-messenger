import Block from '../../../../core/block';

interface ModalProps {
  visible?: boolean;
  content?: any;
  events?: {
    click?: (event: MouseEvent) => void;
  };
}

/**
 * Класс для отображения модального окна.
 * @extends Block
 */
class Modal extends Block {
  /**
   * Создает экземпляр Modal.
   * @param {ModalProps} props - Свойства модального окна.
   */
  constructor(props: ModalProps) {
    super(props);

    this.setProps({
      events: {
        click: this.handleBackdropClick.bind(this),
      },
    });
  }

  /**
   * Обрабатывает нажатие на фон модального окна и закрывает его, если клик был по фону.
   * @param {MouseEvent} event - Событие клика.
   */
  handleBackdropClick(event: MouseEvent) {
    if (event.target === this.element) {
      this.hide();
    }
  }

  /**
   * Отображает модальное окно.
   */
  show() {
    this.setProps({visible: true});
  }

  /**
   * Скрывает модальное окно.
   */
  hide() {
    this.setProps({visible: false});
  }

  /**
   * Рендерит модальное окно.
   * @return {string} HTML разметка модального окна.
   */
  render() {
    return `
      <div class="modal ${this.props.visible ? 'modal--visible' : ''}">
        <div class="modal__content">
          {{{ content }}}
        </div>
      </div>
    `;
  }
}

export default Modal;
