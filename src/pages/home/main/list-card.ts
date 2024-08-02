import Block from '../../../core/block';
import {connect} from '../../../scripts/connect';
import ProfileButton from '../../../components/profile-button';
import SearchBar from '../../../components/search';
import LogoutButton from '../../../components/logout';
import AddChatButton from './components/addChatButton';
import AddChatModal from './components/modals/addChatModal';
import {createChat, getChats} from './api/chats-api';
import {State, User} from '../../../api/type';
import {UserCardProps} from './components/user-card';

interface ListCardProps {
  cards: UserCardProps[];
  showEmpty?: boolean;
  isLoading?: boolean;
  user?: User;
  events?: {
    [key: string]: Function;
  };
}

/**
 * Класс для отображения списка чатов.
 * @extends Block
 */
class ListCard extends Block {
  /**
   * Создает экземпляр ListCard.
   * @param {ListCardProps} props - Свойства компонента списка чатов.
   */
  constructor(props: ListCardProps) {
    super({
      ...props,
      showEmpty: props.cards.length === 0,
      events: {
        // click: props.onClick
      },
    });
    console.log('ListCard props:', props);
  }

  /**
   * Инициализирует дочерние компоненты и устанавливает обработчики событий.
   */
  init(): void {
    const searchBar = new SearchBar({
      onSearch: this.onSearch.bind(this),
    });

    const profileButton = new ProfileButton({
      user: window.store.getState().user,
    });

    const logoutButton = new LogoutButton({});

    const addChatModal = new AddChatModal({
      onSubmit: (title: string) => {
        createChat(title).then(() => {
          this.updateChats();
        });
      },
    });

    const addChatButton = new AddChatButton({
      modal: addChatModal,
    });

    this.children = {
      searchBar,
      profileButton,
      logoutButton,
      addChatButton,
      addChatModal,
    };
  }

  /**
 * Вызывает функцию получения списка чатов
 */
  updateChats() {
    getChats();
  }

  /**
   * Обработчик поиска. Выполняется при вводе текста в поле поиска.
   * @param {string} query - Поисковый запрос.
   */
  onSearch(query: string) {
    console.log('Search query:', query);
  }

  /**
   * Рендерит HTML для компонента списка карточек.
   * @return {string} HTML разметка компонента.
   */
  render(): string {
    return `
      <div class="column-left">
        <ul>
          <div class="column-left_header">
            {{{profileButton}}}
            {{{searchBar}}}
            {{{logoutButton}}}
            {{{addChatButton}}}
          </div>
          {{#if showEmpty}}
              <h2>no conversations yet</h2>
          {{else}}
            {{{cards}}}
          {{/if}}
        </ul>
        {{{addChatModal}}}
      </div>
      `;
  }
}

const mapStateToPropsShort = (state: State) => ({
  isLoading: state.isLoading,
  loginField: state.loginField,
  loginError: state.loginError,
  passwordField: state.passwordField,
});

export default connect(mapStateToPropsShort)(ListCard);
