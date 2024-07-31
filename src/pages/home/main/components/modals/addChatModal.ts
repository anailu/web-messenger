import Block from '../../../../../core/block';

interface AddChatModalProps {
  onSubmit: (title: string) => void;
}

/**
 * Класс для отображения модального окна для добавления чата.
 * @extends Block
 */
class AddChatModal extends Block {
  /**
   * Создает экземпляр AddChatModal.
   * @param {AddChatModalProps} props - Свойства компонента AddChatModal.
   */
  constructor(props: AddChatModalProps) {
    super({
      ...props,
      events: {
        click: (event: Event) => {
          const target = event.target as HTMLElement;
          if (target.classList.contains('modal-submit')) {
            const input = this.element?.querySelector('.chatTitle_input') as HTMLInputElement;
            props.onSubmit(input.value);
          }
          if (target.classList.contains('modal-close')) {
            this.hide();
          }
        },
      },
    });
  }

  /**
   * Рендерит HTML для модального окна.
   * @return {string} HTML разметка модального окна.
   */
  render(): string {
    return `
      <div class="modal" style="display: none;">
        <div class="modal-content smallModal">
          <span class="modal-close">&times;</span>
          <h2>create chat</h2>
          <input type="text" class="chatTitle_input" placeholder="enter chat title"/>
          <button class="modal-submit">create</button>
        </div>
      </div>
    `;
  }
}

export default AddChatModal;
