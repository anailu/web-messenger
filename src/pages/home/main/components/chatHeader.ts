import Block from '../../../../core/block';
import {getChatUsers} from '../api/chats-api';
import {connect} from '../../../../scripts/connect';
import defaultAvatar from '../../../../static/images/default_avatar.png';

const BASE_URL = 'https://ya-praktikum.tech/api/v2/resources/';

interface ChatHeaderProps {
  avatar: string;
  title: string;
  chatId: number;
  modal: Block;
}

/**
 * Класс компонента, который отображает заголовок чата с аватаром
 * @extends Block
 */
class ChatHeader extends Block {
  /**
 * Создает экземпляр ChatHeader
 * @param {ChatHeaderProps} props - Свойства компонента
 */
  constructor(props: ChatHeaderProps) {
    super({
      ...props,
      events: {
        click: async () => {
          const users = await getChatUsers(this.props.chatId);

          if (users) {
            this.children.modal.setProps({
              users,
              chatAvatar: this.props.avatar,
              chatTitle: this.props.title,
              chatId: this.props.chatId,
            });

            this.children.modal.show();
          } else {
            console.error('no users received from server');
          }
        },
      },
    });
  }

  /**
   * Обновляет компоненты при изменении свойств.
   * @param {ChatHeaderProps} oldProps - Старые свойства.
   * @param {ChatHeaderProps} newProps - Новые свойства.
   * @return {boolean} true, если компонент был обновлен, иначе false.
   */
  componentDidUpdate(oldProps: ChatHeaderProps, newProps: ChatHeaderProps): boolean {
    if (oldProps.avatar !== newProps.avatar || oldProps.title !== newProps.title) {
      this.render();
    }
    return true;
  }

  /**
   * Рендерит компонент ChatHeader
   * @return {string} - HTML разметка для компонента
   */
  render() {
    const {avatar, title} = this.props;

    const avatarUrl = avatar ? `${BASE_URL}${avatar}` : defaultAvatar;

    return `
      <div class="chatHeader">
        <img class="chatHeaderAvatar avatar_image" src="${avatarUrl}" alt="chat's avatar">
        <div class="chatHeaderTitle">${title}</div>
      </div>
    `;
  }
}

const mapStateToProps = (state: {
  selectedCard?: { avatar: string, title: string, id: number }
}) => ({
  selectedCard: state.selectedCard,
  chatId: state.selectedCard?.id,
});

export default connect(mapStateToProps)(ChatHeader);
