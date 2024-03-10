import Block, {BlockProps} from '../../../scripts/blockForm';
import {validatePassword} from '../../../scripts/validationRules';
import {sendDataToConsole} from '../../../scripts/saveData';
import {validateForm, addBlurValidation} from '../../../scripts/formValidationUtils';

/**
 * интерфейс для свойств блока формы пароля
 * @interface PasswordFormBlockProps
 * @extends BlockProps
 * @property {string} formId - идентификатор формы
 * @property {string} saveButtonId - идентификатор кнопки сохранения
 */
interface PasswordFormBlockProps extends BlockProps {
  formId: string;
  saveButtonId: string;
  onSaveButtonClick: (event: Event) => void;
}
/**
 * класс блока формы пароля
 * @class PasswordFormBlock
 * @extends {Block}
 * @param {PasswordFormBlockProps} props - свойства блока формы пароля
 */
class PasswordFormBlock extends Block {
  /**
   * конструктор класса PasswordFormBlock
   * @param {PasswordFormBlockProps} props - cвойства блока формы пароля
   */
  constructor(props: PasswordFormBlockProps) {
    const form = document.getElementById(props.formId) as HTMLFormElement | null;
    const saveButton = document.getElementById(props.saveButtonId) as HTMLButtonElement | null;
    super(form);
    if (!form || !saveButton) {
      console.error(`form or save button not found. form ID: ${props.formId},
                     save button ID: ${props.saveButtonId}`);
      return;
    }

    this._addEvents({
      submit: props.onSaveButtonClick,
    });

    const newPasswordInput = form.querySelector(
        'input[name="newPassword"]'
    ) as HTMLInputElement | null;
    const oldPasswordInput = form.querySelector(
        'input[name="oldPassword"]'
    ) as HTMLInputElement | null;

    if (!newPasswordInput || !oldPasswordInput) {
      console.error('password not found in the form');
      return;
    }

    this.addBlurValidation(newPasswordInput);
    this.addBlurValidation(oldPasswordInput);
  }

  /**
   * добавляет валидацию при потере фокуса у поля ввода
   * @private
   * @param {HTMLInputElement} input - поле ввода для валидации
   */
  private addBlurValidation(input: HTMLInputElement): void {
    addBlurValidation(input, validatePassword, 'invalid password format');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const onSaveButtonClick = function(event: Event) {
    event.preventDefault();
    const formData: { [key: string]: string } = {};
    const form = document.getElementById('passwordForm') as HTMLFormElement;

    if (!form) {
      console.error('form element not found.');
      return;
    }

    const inputElements = form.querySelectorAll('input') as NodeListOf<HTMLInputElement>;

    if (!inputElements) {
      console.error('input elements not found.');
      return;
    }

    inputElements.forEach((element) => {
      if (element.type !== 'submit') {
        const fieldName = element.name;
        const fieldValue = element.value.trim();

        if (!validateForm(fieldName, fieldValue, validatePassword, 'invalid password format')) {
          return;
        }

        formData[fieldName] = fieldValue;
      }
    });

    sendDataToConsole(formData);
    form.reset();
  };

  const passwordFormBlock = new PasswordFormBlock({
    formId: 'passwordForm',
    saveButtonId: 'savePasswordButton',
    onSaveButtonClick,
    events: {
      submit: onSaveButtonClick,
    },
  });
  passwordFormBlock;
});
