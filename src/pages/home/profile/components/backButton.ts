import Block from '../../../../core/block';
import arrowBack from '../../../../static/images/arrow_back.svg';

interface BackLinkProps {
  href: string
  onClick?: () => void;
}

/**
 * Класс для создания кнопки "Назад".
 * @extends Block
 */
export default class ButtonBack extends Block {
  /**
   * Создает экземпляр ButtonBack.
   * @param {BackLinkProps} props - Свойства кнопки "Назад".
   */
  constructor(props: BackLinkProps) {
    super({
      ...props,
      events: {
        click: (event: Event) => {
          event.preventDefault();
          window.router.go(props.href);
        },
      },
    });
  }

  /**
   * Рендерит HTML для кнопки "Назад".
   * @return {string} HTML разметка для кнопки "Назад".
   */
  render(): string {
    return `
      <nav class="back-link_container">
        <a class="back-link" href="{{href}}">
          <img class="back-arrow" src="${arrowBack}" alt="back">
        </a>
      </nav>
    `;
  }
}
