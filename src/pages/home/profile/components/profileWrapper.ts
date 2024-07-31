import Block from '../../../../core/block';
import Modal from '../modals/modal';
import EditPasswordForm from '../modals/editPasswordForm';
import EditProfileForm from '../modals/editProfileForm';
import EditButton from '../../../../components/linkButton';
import avatar from '../../../../static/images/avatar.svg';
import {User} from '../../../../api/type';

const BASE_URL = 'https://ya-praktikum.tech/api/v2/resources/';

interface ProfileWrapperProps {
  user: User;
}

/**
 * Класс, представляющий обертку профиля пользователя.
 * @extends Block
 */
export default class ProfileWrapper extends Block {
  /**
   * Создает экземпляр ProfileWrapper.
   * @param {ProfileWrapperProps} props - Свойства для обертки профиля.
   */
  constructor(props: ProfileWrapperProps) {
    super(props);
    this.init();
  }

  /**
   * Инициализирует модальные окна и кнопки редактирования.
   */
  init() {
    const editProfileModal = new Modal({
      content: new EditProfileForm({user: this.props.user}),
      visible: false,
    });

    const editPasswordModal = new Modal({
      content: new EditPasswordForm({user: this.props.user}),
      visible: false,
    });

    this.children.editProfileButton = new EditButton({
      text: 'edit profile',
      modal: editProfileModal,
      events: {
        click: () => {
          editProfileModal.show();
          console.log('Button clicked (profile wrapper)');
        },
      },
    });

    this.children.editPasswordButton = new EditButton({
      text: 'edit password',
      modal: editPasswordModal,
      events: {
        click: () => {
          console.log('Password Button clicked');
          editPasswordModal.show();
        },
      },
    });

    this.children.editProfileModal = editProfileModal;
    this.children.editPasswordModal = editPasswordModal;
  }

  /**
   * Отображает указанное модальное окно.
   * @param {string} modalName - Название модального окна для отображения.
   */
  showModal(modalName: string) {
    (this.children[modalName] as Modal).show();
  }

  /**
   * Рендерит HTML структуру для обертки профиля.
   * @return {string} HTML разметка для обертки профиля.
   */
  render(): string {
    const {user} = this.props;
    const avatarUrl = user.avatar ?
      (user.avatar.startsWith('http') ? user.avatar : `${BASE_URL}${user.avatar}`) :
      avatar;

    return `
      <div class="profile-container">
        <div class="avatar-container">
          <img class="avatar_img" src="${avatarUrl}" alt="user's avatar" />
        </div>
        <div class="list-info">
          <div class="line-info">
            <p class="line-title">email</p>
            <p class="profile-data">${user.email}</p>
          </div>
          <div class="line-info">
            <p class="line-title">login</p>
            <p class="profile-data">${user.login}</p>
          </div>
          <div class="line-info">
            <p class="line-title">first name</p>
            <p class="profile-data">${user.first_name}</p>
          </div>
          <div class="line-info">
            <p class="line-title">last name</p>
            <p class="profile-data">${user.second_name}</p>
          </div>
          <div class="line-info">
            <p class="line-title">phone</p>
            <p class="profile-data">${user.phone}</p>
          </div>
        </div>
        {{{editProfileButton}}}
        {{{editPasswordButton}}}
        {{{editProfileModal}}}
        {{{editPasswordModal}}}
      </div>
    `;
  }
}
