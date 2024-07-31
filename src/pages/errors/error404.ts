import ErrorBlock from './index';
import Block from '../../core/block';
import {connect} from '../../scripts/connect';

interface AppState {
  errorCode?: string;
  errorMessage?: string;
  logoutError?: string;
  registerError?: string;
}

interface Error404Props {
  errorCode?: string;
  errorMessage?: string;
}

/**
 * Класс для отображения страницы ошибки 404
 * @extends Block
 */
class error404 extends Block {
  /**
   * Создает экземпляр Error404.
   * @param {Error404Props} props - Свойства компонента.
   */
  constructor(props: Error404Props) {
    super({
      ...props,
      error404: new ErrorBlock({
        errorCode: '404',
        errorMessage: 'not found',
      }),
    });
  }

  /**
 * метод для рендеринга HTML формы в строку
 * @return {string} - HTML форма в виде строки
 */
  render() {
    return (`
      <div class="content">
        {{{ error404 }}}
      </div>
    `);
  }
}

const mapStateToProps = (state: AppState): Error404Props => ({
  errorCode: state.errorCode,
  errorMessage: state.errorMessage,
});

export default connect(mapStateToProps)(error404);
