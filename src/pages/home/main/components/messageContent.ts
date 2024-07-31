import Block from '../../../../core/block';
import {connect} from '../../../../scripts/connect';
import {State, Message} from '../../../../api/type';

/**
 * Компонент для отображения содержимого сообщений в чате.
 * @extends Block
 */
class MessageContent extends Block {
  /**
   * Рендерит содержимое сообщений.
   * @return {string} HTML разметка для отображения сообщений.
   */
  render() {
    const messages: Message[] = this.props.messages || [];
    const userId: number = this.props.userId;

    console.log('MessageContent render: messages:', messages);

    if (!messages.length) {
      return `
        <div class="dialog_content"><p>no messages yet</p></div>
      `;
    }

    return `
      <div class="dialog_content">
      ${messages.map((message) => `
        <div class="message_container message ${message.user_id === userId ?
        'message--mine' :
        'message--theirs'}">
          <p><strong>${message.user_id === userId ? 'You' :
          'User ' +
          message.user_id}:</strong> ${message.content}</p>
        </div>
      `).join('')}
    </div>
    `;
  }
}

export default connect((state: State) => ({
  messages: state.messages,
  userId: state.userId,
}))(MessageContent);
