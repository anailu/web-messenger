import Block, {BlockProps} from '../../../scripts/block';
import {validatePassword} from '../../../scripts/validationRules';
import formFieldsTemplate from '../../../templates/formFields.hbs?raw';

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

    currentPasswordInput.value = '';
    newPasswordInput.value = '';
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
    const formData = {
      formId: 'editProfileForm',
      showAvatar: false,
      inputsContainerClass: 'list-info',
      fields: [
        {id: 'currentPassword', label: 'currentPassword', name: 'currentPassword', type: 'password',
          value: ''},
        {id: 'newPassword', label: 'newPassword', name: 'newPassword', type: 'password', value: ''},
      ],
      buttonText: 'save',
      buttonId: 'editPasswordButton',
    };

    const template = Handlebars.compile(formFieldsTemplate);
    const renderedHtml = template(formData);

    return renderedHtml;
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
    beforeunload: () => {
      passwordChangeForm.componentWillUnmount();
    },
  },
});

renderForm('.profile-container', passwordChangeForm);
