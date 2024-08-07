import Block from '../core/block';
import Input from './input/input';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

/**
 * Компонент поисковой строки
 * @extends Block
 */
class SearchBar extends Block {
  props: SearchBarProps;
  children: {
    input?: Input;
  };

  /**
   * Конструктор компонента
   * @param {SearchBarProps} props - Пропсы компонента
   */
  constructor(props: SearchBarProps) {
    super(props);
    this.props = props;
    this.children = {};
  }

  /**
   * Инициализация компонента
   */
  init() {
    this.children = {
      input: new Input({placeholder: 'search', input_class: 'search_input'}),
    };
  }

  /**
   * Обрабатывает клик по кнопке поиска
   */
  onSearchClick() {
    const query = this.children.input?.getValue();

    if (query !== undefined) {
      this.props.onSearch(query);
    }
  }

  /**
   * Рендерит HTML для компонента
   * @return {string} - HTML строка
   */
  render() {
    return `
      <div class="input_search__container">
        {{{ input }}}
      </div>
    `;
  }
}

export default SearchBar;
