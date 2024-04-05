import Block, {BlockProps} from '../../../scripts/block';
import {validatePassword} from '../../../scripts/validationRules';

/**
 * класс блока формы смены пароля
 * @class PasswordChangeForm
 * @extends {Block}
 * @param {PasswordChangeForm} props - свойства блока формы
 */
class PasswordChangeForm extends Block<BlockProps> {
  /**
   * конструктор класса ExtendedBlock
   * @constructor
   * @param {ExtendedBlockProps} props - объект свойств блока
   */
  constructor(props: BlockProps) {
    super('form', props);
    this.addEventListeners();
  }

  /**
   * обработчик клика по кнопке входа
   * @param {Event} event - событие клика
   */
  handleClick(event: Event) {
    event.preventDefault();
    const currentPasswordInput = this.element.querySelector('#currentPassword') as HTMLInputElement;
    const newPasswordInput = this.element.querySelector('#newPassword') as HTMLInputElement;

    if (!validatePassword(currentPasswordInput.value) ||
        !validatePassword(newPasswordInput.value)) {
      alert('enter valid password');
      return;
    }

    const formData = {
      currentPassword: currentPasswordInput.value,
      newPassword: newPasswordInput.value,
    };

    console.log('Form data:', formData);
  }

  /**
   * обработчик потери фокуса поля ввода
   * @param {Event} event - событие потери фокуса
   */
  handleBlur(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.tagName === 'INPUT') {
      if (!validatePassword(target.value)) {
        alert('enter valid password');
      }
    }
  }

  /**
   * метод для удаления блока
   */
  componentWillUnmount() {
    super.componentWillUnmount();
  }

  /**
   * метод для рендеринга HTML формы в строку
   * @return {string} - HTML форма в виде строки
   */
  render(): string {
    return `
      <form name="passwordForm" id="passwordForm">
        <div class="list-info edit-profile_container">
          <label for="currentPassword">current password</label>
          <input type="password" id="currentPassword" name="currentPassword">
      
          <label for="newPassword">new password</label>
          <input type="password" id="newPassword" name="newPassword">
        </div>
        <button id="savePasswordButton" type="button"">save</button>
      </form>
    `;
  }

  /**
   * метод для добавления слушателей событий
   */
  addEventListeners() {
    this.element.querySelector('#savePasswordButton')
        ?.addEventListener('click', this.handleClick.bind(this));
    this.element.querySelector('#currentPassword')
        ?.addEventListener('blur', this.handleBlur.bind(this));
    this.element.querySelector('#newPassword')
        ?.addEventListener('blur', this.handleBlur.bind(this));
  }
}

/**
 * функция для рендеринга формы
 * @param {string} query - селектор для поиска места вставки формы
 * @param {Block} block - экземпляр блока формы
 * @return {HTMLElement | undefined} - HTML элемент, куда была вставлена форма
 */
function renderForm(query: string, block: Block) {
  const root = document.querySelector(query);
  if (root) {
    root.appendChild(block.getContent());
    return root;
  } else {
    throw new Error(`element with selector ${query} not found`);
  }
}

const passwordChangeForm = new PasswordChangeForm({
  events: {
    blur: (event: Event) => {
      passwordChangeForm.handleBlur(event);
    },
    submit: (event: Event) => {
      passwordChangeForm.handleClick(event);
    },
  },
});

renderForm('.profile-container', passwordChangeForm);

window.addEventListener('beforeunload', () => {
  passwordChangeForm.componentWillUnmount();
});
