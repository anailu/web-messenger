import {logout} from '../pages/home/loginup/auth/logout';
import Block from '../core/block';

/**
 * Компонент кнопки выхода из системы
 * @extends Block
 */
class LogoutButton extends Block {
  /**
   * Конструктор компонента
   * @param {LogoutButtonProps} props - Пропсы компонента
   */
  constructor(props = {}) {
    super(props);
    this.setProps({
      ...props,
      events: {
        click: this.onClick.bind(this),
      },
    });
  }

  /**
   * Обработчик события клика по кнопке
   * Выполняет выход из системы
   */
  onClick() {
    logout();
  }

  /**
   * Рендерит HTML для компонента
   * @return {string} - HTML строка
   */
  render() {
    return `
        <button class="logout-button" style="color: white;">logout</button>
    `;
  }
}

export default LogoutButton;
