import Block from '../../../../core/block';
import Input from '../../../../components/input/input';
import {sendMessage} from '../../../../scripts/sendMessages';
import attachIcon from '../../../../static/images/attach_icon.svg';
import sendMessageIcon from '../../../../static/images/send-message.svg';

/**
 * Класс для отображения нижней панели чата
 * @extends Block
 */
class ChatBottomBar extends Block {
  /**
   * Инициализация компонента
   * @private
   */
  init() {
    this.children = {
      input: new Input({
        placeholder: 'write a message',
        input_class: 'chat_input',
        id: 'messageInput',
      }),
    };

    this.setProps({
      events: {
        submit: this.onSendClick.bind(this),
      },
    });
  }

  /**
   * Обработчик события отправки сообщения.
   * @param {Event} event - Событие отправки формы.
   * @private
   */
  onSendClick(event: any) {
    event.preventDefault();

    const inputComponent = this.children.input;
    if (!inputComponent) {
      console.error('Input component not found');
      return;
    }

    const messageInput = inputComponent.element as HTMLInputElement;
    if (!messageInput) {
      console.error('Input element not found');
      return;
    }

    const message = messageInput.value;

    if (message.trim() !== '') {
      sendMessage(event);
    }

    messageInput.value = '';
  }

  /**
   * Рендеринг компонента
   * @return {string} Шаблон компонента.
   */
  render() {
    return `
      <form id="message" class="chat_bottombar">
        <input type="file" id="fileInput" class="attachFile_input" multiple>
        <label for="fileInput" class="bottombar_attach-button">
            <img src="${attachIcon}" alt="attach" class="attach-icon">
        </label>
        {{{ input }}}
        <button type="submit" class="send-message" id="sendMessage">
            <img src="${sendMessageIcon}" alt="send" class="send-message_icon">
        </button>
      </form>
    `;
  }
}

export default ChatBottomBar;
