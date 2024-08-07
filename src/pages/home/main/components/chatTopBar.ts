import Block from '../../../../core/block';
import addMember from '../../../../static/images/add_member.svg';
import delMember from '../../../../static/images/del_member.svg';
import delChat from '../../../../static/images/del_chat.svg';
import SmallModal from './modals/dialogMenuModal';
import IconButton from './iconButton';
import {deleteChat} from '../api/chats-api';
import {addUsersToChat} from '../api/chatsUsers-api';
import {findUser} from '../api/user-Api';
import {delUsersFromChat} from '../api/chatsUsers-api';

interface ChatTopBarProps {
  title: string;
  avatar: string;
  chatId: number;
}

/**
 * Класс для отображения верхней панели чата
 * @extends Block
 */
class ChatTopBar extends Block {
  /**
   * Создает экземпляр ChatTopBar.
   * @param {ChatTopBarProps} props - Свойства компонента.
   */
  constructor(props: ChatTopBarProps) {
    super({
      ...props,
    });
  }

  /**
   * Инициализация компонента
   * Создает и настраивает модальные окна и кнопки управления.
   * @private
   */
  init(): void {
    const addMemberModal = new SmallModal({
      title: 'add member',
      content: '<input type="text" id="addMemberLogin" placeholder="login" />',
      buttonText: 'add',
      onSubmit: async () => {
        const input = document.getElementById('addMemberLogin') as HTMLInputElement;

        const login = input.value;
        if (login) {
          try {
            const user = await findUser(login);

            if (user) {
              await addUsersToChat([user.id], this.props.chatId);
              alert(`User ${user.login} added to chat`);
            } else {
              alert('User not found');
            }
          } catch (error) {
            console.error('Error during user search or adding:', error);
            alert('Failed to add user to chat.');
          } finally {
            addMemberModal.hide();
          }
        }
      },
    });

    const delMemberModal = new SmallModal({
      title: 'delete member',
      content: '<input type="text" id="deleteMemberLogin" placeholder="login" />',
      buttonText: 'delete',
      onSubmit: async () => {
        const input = document.getElementById('deleteMemberLogin') as HTMLInputElement;
        const login = input.value;

        if (login) {
          try {
            const user = await findUser(login);

            if (user) {
              await delUsersFromChat([user.id], this.props.chatId);
              alert(`User ${user.login} removed from chat`);
            } else {
              alert('User not found');
            }
          } catch (error) {
            console.error('Error during user search or removal:', error);
            alert('Failed to remove user from chat.');
          } finally {
            delMemberModal.hide();
          }
        }
      },
    });

    const delChatModal = new SmallModal({
      title: 'delete chat',
      content: '<p>are you sure you want to delete this chat?</p>',
      buttonText: 'yes, delete',
      onSubmit: () => {
        console.log('submit'),

        deleteChat(this.props.chatId);
        delChatModal.hide();
      },
    });

    const addMemberButton = new IconButton({
      icon: addMember,
      modal: addMemberModal,
    });

    const delMemberButton = new IconButton({
      icon: delMember,
      modal: delMemberModal,
    });

    const delChatButton = new IconButton({
      icon: delChat,
      modal: delChatModal,
    });

    this.children = {
      addMemberButton,
      delMemberButton,
      delChatButton,
      addMemberModal,
      delMemberModal,
      delChatModal,
    };
  }
  /**
   * Рендеринг компонента
   * @return {string} Шаблон компонента.
   */
  render() {
    const {title, avatar} = this.props;

    return `
      <div class="chat-topbar_container person">
        <div class="person">
          <img class="person-avatar avatar_image" src="${avatar}" alt="chat's avatar">
          <div class="person-name">${title}</div>
        </div> 
        <div class="dialogMenu_buttons">
          {{{addMemberButton}}}
          {{{delMemberButton}}}
          {{{delChatButton}}}
        </div>
        {{{addMemberModal}}}
        {{{delMemberModal}}}
        {{{delChatModal}}}
      </div>
    `;
  }
}

export default ChatTopBar;
