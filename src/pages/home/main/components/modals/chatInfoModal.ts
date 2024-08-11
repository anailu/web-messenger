import Block from '../../../../../core/block';
import {uploadChatAvatar} from '../../api/chats-api';
import {delUsersFromChat} from '../../api';
import defaultAvatar from '../../../../../static/images/default_avatar.png';
import groupAvatar from '../../../../../static/images/group-avatar.png';
import {User} from '../../../../../api/type';

const BASE_URL = 'https://ya-praktikum.tech/api/v2/resources/';

interface ChatUsersModalProps {
  users: Array<{ id: number, name: string, avatar: string }>;
  chatId: number;
  chatAvatar: string
  chatTitle: string;
  onSubmit: () => void;
}

/**
 * Класс ChatInfoModal, отвечает за отображение и управление модальным окном информации о чате
 * @class
 * @extends {Block}
 */
class ChatInfoModal extends Block {
  /**
   * Создает экземпляр ChatInfoModal
   * @param {ChatUsersModalProps} props - Свойства, передаваемые в компонент
   */
  constructor(props: ChatUsersModalProps) {
    super({
      ...props,
      events: {
        click: (event: Event) => {
          const target = event.target as HTMLElement;
          if (target.classList.contains('modal-button')) {
            props.onSubmit();
          }
          if (target.classList.contains('modal')) {
            this.hide();
          }
          if (target.classList.contains('deleteMember_button')) {
            const userId = target.dataset.userId;
            if (userId) {
              this.handleDeleteMember(Number(userId));
            }
          }
        },

        change: (event: Event) => {
          const target = event.target as HTMLInputElement;
          if (target.classList.contains('chatAvatar_input')) {
            this.handleAvatarChange(target);
          }
        },
      },
    });
  }

  /**
   * Обрабатывает удаление пользователя из чата
   * @param {number} userId - ID пользователя, который будет удален
   * @return {Promise<void>}
   */
  async handleDeleteMember(userId: number) {
    try {
      await delUsersFromChat([userId], this.props.chatId);
      alert(`User removed from chat`);

      this.setProps({
        users: this.props.users.filter((user: User) => user.id !== userId),
      });
    } catch (error) {
      console.error('Error removing user from chat:', error);
      alert('Failed to remove user from chat.');
    }
  }

  /**
   * Обрабатывает изменение аватара чата
   * @param {HTMLInputElement} input - Входной элемент для выбора файла
   * @return {Promise<void>}
   */
  async handleAvatarChange(input: HTMLInputElement) {
    const file = input.files?.[0];
    if (file) {
      try {
        await uploadChatAvatar(this.props.chatId, file);

        const reader = new FileReader();
        reader.onload = () => {
          if (this.element) {
            const previewImage = this.element.querySelector('.avatar_image') as HTMLImageElement;
            if (previewImage) {
              previewImage.src = reader.result as string;
            }
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error uploading avatar:', error);
      }
    }
  }

  /**
   * Показывает модальное окно
   */
  show() {
    (this.element as HTMLElement).style.display = 'block';
  }

  /**
   * Скрывает модальное окно
   */
  hide() {
    (this.element as HTMLElement).style.display = 'none';
  }

  /**
   * Рендерит HTML-код компонента
   * @return {string} HTML-код модального окна
   */
  render() {
    const {users, chatAvatar, chatTitle} = this.props;
    const chatAvatarUrl = chatAvatar ? `${BASE_URL}${chatAvatar}` : groupAvatar;

    return `
      <div class="modal">
        <div class="smallModal">
          <div class="modal-header">
            <label for="chat-avatar-input" class="chatAvatar_label">
              <img 
                src="${chatAvatarUrl}" 
                alt="${chatTitle} avatar" 
                class="chat_image">
                <div class="overlay">click to change avatar</div>
              <input 
                type="file" 
                id="chat-avatar-input" 
                class="chatAvatar_input" 
                accept="image/*">
            </label>
            <h2 class="chatInfoTitle">chat "${chatTitle}"</h2>
          </div>
          <div class="modal-body">
            <ul class="user-list">
            ${users.map((user: User) => {
    const avatarUrl = user.avatar ? `${BASE_URL}${user.avatar}` : defaultAvatar;

    return `
                <li class="user-item chat_container">
                  <img class="avatar_image" src="${avatarUrl}" alt="${user.login}'s avatar">
                  <span class="user-name">${user.login}</span>
                  <button class="deleteMember_button" data-user-id="${user.id}">delete</button>
                </li>
              `;
  }).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
  }
}

export default ChatInfoModal;
