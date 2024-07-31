import Block from '../../../../../core/block';

interface SmallModalProps {
  title: string;
  content: string;
  buttonText: string;
  onSubmit: any;
}

/**
 * Класс для отображения небольшого модального окна.
 * @extends Block
 */
class SmallModal extends Block {
  /**
   * Создает экземпляр SmallModal.
   * @param {SmallModalProps} props - Свойства компонента SmallModal.
   */
  constructor(props: SmallModalProps) {
    super({
      ...props,
      events: {
        click: (event: Event) => {
          const target = event.target as HTMLElement;
          if (target.classList.contains('modal-button')) {
            props.onSubmit();
          }
          if (target.classList.contains('modal-close')) {
            this.hide();
          }
        },
      },
    });
  }

  /**
   * Показывает модальное окно.
   */
  show() {
    (this.element as HTMLElement).style.display = 'block';
  }

  /**
   * скрывает модальное окно.
   */
  hide() {
    (this.element as HTMLElement).style.display = 'none';
  }

  /**
   * Рендерит HTML для модального окна.
   * @return {string} HTML разметка модального окна.
   */
  render() {
    return `
      <div class="modal">
        <div class="modal-content smallModal">
        <span class="modal-close">&times;</span>
          <h2>${this.props.title}</h2>
          <div class="modal-body">
            ${this.props.content}
          </div>
          <button class="modal-button">${this.props.buttonText}</button>
        </div>
      </div>
    `;
  }
}

export default SmallModal;
