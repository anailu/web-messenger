import Block from '../../../../core/block';
import AddChatModal from './modals/addChatModal';
import createChatIcon from '../../../../static/images/create_chat.svg';

interface AddChatButtonProps {
  modal: AddChatModal;
}

/**
 * Компонент кнопки для добавления чата.
 * @extends Block
 */
class AddChatButton extends Block {
  /**
   * Создает экземпляр AddChatButton.
   * @param {AddChatButtonProps} props - Свойства компонента.
   */
  constructor(props: AddChatButtonProps) {
    super(props);
    this.setProps({
      ...props,
      events: {
        click: this.onClick.bind(this),
      },
    });
  }

  /**
   * Обработчик клика по кнопке.
   * Отображает переданное модальное окно.
   * @private
   */
  onClick() {
    this.props.modal.show();
  }

  /**
   * Отображение компонента.
   * @return {string} Шаблон компонента.
   */
  render() {
    return `
      <button class="addChat-button">
        <img src="${createChatIcon}" class="createChat_icon" alt="create chat" title="create chat">
      </button>
    `;
  }
}

export default AddChatButton;
