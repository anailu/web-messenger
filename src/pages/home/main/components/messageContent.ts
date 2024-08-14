import Block from '../../../../core/block';
import {connect} from '../../../../scripts/connect';
import {State, Message, User} from '../../../../api/type';

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
    const userId = this.props.user;
    const usersInChat = this.props.usersInChat || [];

    if (!messages.length) {
      return `
        <div class="dialog_content"><p>no messages yet</p></div>
      `;
    }

    const formatTime = (timestamp: string) => {
      const date = new Date(timestamp);
      const day = date.getDate().toString().padStart(2, '0');
      const month = date.toLocaleString('en-EN', {month: 'long'});
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${day} ${month} ${year}, ${hours}:${minutes}`;
    };

    const getUserName = (userId: number) => {
      const user = usersInChat.find((user: User) => user.id === userId);
      return user ? user.login : 'Unknown User';
    };

    return `
      <div class="dialog_content">
      ${messages.map((message) => {
    const isMyMessage = message.user_id === userId.id;
    const userName = isMyMessage ? 'you' : getUserName(message.user_id);
    const messageTime = formatTime(message.time);

    return `
          <div class="message_container message ${isMyMessage ?
          'message--mine' :
          'message--theirs'}">
            <p class="message_text"><strong>${userName}:</strong> ${message.content}</p>
            <span class="message_time">${messageTime}</span>
          </div>
        `;
  }).join('')}
    </div>
    `;
  }
}

export default connect((state: State) => ({
  messages: state.messages,
  user: state.user,
  usersInChat: state.usersInChat,
}))(MessageContent);
