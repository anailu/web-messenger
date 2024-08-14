import Block from '../../core/block';
import Button from '../../components/button/button';

interface ErrorBlockProps {
  errorCode: string;
  errorMessage: string;
}

/**
 * Компонент для отображения блока ошибки
 * @extends Block
 */
class ErrorBlock extends Block {
  children: Record<string, Block<any>>;

  /**
   * Создает экземпляр ErrorBlock.
   * @param {ErrorBlockProps} props - Свойства компонента.
   */
  constructor(props: ErrorBlockProps) {
    super(props);
    this.children = {};
  }

  /**
   * Инициализация компонента
   * Создает кнопку для возврата на главную страницу.
   * @private
   */
  init() {
    const ButtonBack = new Button({
      label: 'back to main',
      type: 'link',
      onClick: () => {
        window.router.go('/messenger');
      },
    });

    this.children.ButtonBack = ButtonBack;
  }

  /**
   * Отображение компонента
   * @return {string} Шаблон компонента.
   */
  render() {
    return (`
      <div class="error-block">
        <h1 class="type_error">{{errorCode}}</h1>
        <p>{{errorMessage}}</p>
        {{{ ButtonBack }}}
      </div>
    `);
  }
}

export default ErrorBlock;
