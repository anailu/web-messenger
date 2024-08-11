import ErrorBlock from './index';
import Block from '../../core/block';
import {connect} from '../../scripts/connect';
import {AppState} from '../../api/type';

interface Error500Props {
  errorCode?: string;
  errorMessage?: string;
}

/**
 * Класс для отображения страницы ошибки 500
 * @extends Block
 */
class Error500 extends Block {
  /**
   * Создает экземпляр Error500.
   * @param {Error500Props} props - Свойства компонента.
   */
  constructor(props: Error500Props) {
    super({
      ...props,
      error500: new ErrorBlock({
        errorCode: '500',
        errorMessage: 'Internal Server Error',
      }),
    });
  }

  /**
   * Метод для рендеринга HTML формы в строку.
   * @return {string} - HTML форма в виде строки.
   */
  render() {
    return (`
      <div class="content">
        {{{ error500 }}}
      </div>
    `);
  }
}

/**
 * Функция для маппинга состояния приложения в свойства компонента.
 * @param {AppState} state - Состояние приложения.
 * @return {Error500Props} - Свойства компонента.
 */
const mapStateToProps = (state: AppState): Error500Props => ({
  errorCode: state.errorCode,
  errorMessage: state.errorMessage,
});

export default connect(mapStateToProps)(Error500);
