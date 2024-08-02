import Block from '../core/block';
import profileIcon from '../static/images/profile_icon.svg';
import {loadProfile} from '../api/me';
import {User} from '../api/type';

interface ProfileButtonProps {
  user?: User;
  events?: {
    click?: () => void;
  };
}

/**
 * Кнопка профиля пользователя
 * @extends Block
 */
class ProfileButton extends Block {
  props: ProfileButtonProps;

  /**
   * Конструктор компонента
   * @param {ProfileButtonProps} props - Пропсы компонента
   */
  constructor(props: ProfileButtonProps) {
    super({
      ...props,
      events: {
        click: () => {
          loadProfile();
        },
      },
    });

    this.props = props;
  }

  /**
   * Рендерит HTML для компонента
   * @return {string} - HTML строка
   */
  render() {
    return `
      <div class="profile-icon-link" title="your profile">
        <a class="profile-link">
            <img src="${profileIcon}" class="profile-icon" alt="profile">
        </a>
      </div>
    `;
  }
}

export default ProfileButton;
