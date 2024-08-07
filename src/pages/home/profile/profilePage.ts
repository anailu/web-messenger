import Block from '../../../core/block';
import ProfileWrapper from './components/profileWrapper';
import {connect} from '../../../scripts/connect';
import ButtonBack from './components/backButton';
import {User, State} from '../../../api/type';

interface ProfilePageProps {
  user: User;
}

/**
 * Класс для отображения страницы профиля пользователя.
 * @extends Block
 */
class ProfilePage extends Block {
  /**
   * Создает экземпляр ProfilePage.
   * @param {ProfilePageProps} props - Свойства страницы профиля.
   */
  constructor(props: ProfilePageProps) {
    super({
      ...props,
      title: 'Profile',
    });

    this.init();
  }

  /**
   * Инициализирует компоненты страницы профиля.
   */
  init() {
    this.children.backButton = new ButtonBack({
      href: '/messenger',
    });

    this.children.content = new ProfileWrapper({
      user: this.props.user,
    });
  }

  /**
   * Обновляет компонент при изменении свойств.
   * @param {ProfilePageProps} oldProps - Старые свойства.
   * @param {ProfilePageProps} newProps - Новые свойства.
   * @return {boolean} true, если компонент был обновлен, иначе false.
   */
  componentDidUpdate(oldProps: ProfilePageProps, newProps: ProfilePageProps) {
    if (oldProps.user !== newProps.user) {
      this.children.content.setProps({user: newProps.user});
    }
    return true;
  }

  /**
   * Рендерит страницу профиля.
   * @return {string} HTML разметка страницы.
   */
  render() {
    return `
      <div class="profilePage_container">
        {{{backButton}}}
        {{{content}}}
      </div>
    `;
  }
}

/**
 * Функция для маппинга состояния хранилища к свойствам компонента.
 * @param {State} state - Состояние хранилища.
 * @return {Partial<ProfilePageProps>} Свойства, передаваемые в компонент.
 */
const mapStateToProps = ({user}: State) => ({
  user: user as User,
});

export default connect(mapStateToProps)(ProfilePage);
